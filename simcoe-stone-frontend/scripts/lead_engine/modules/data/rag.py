"""
RAG (Retrieval Augmented Generation) Module

This module handles vector retrieval and search operations:
1. Managing vector embeddings in ChromaDB
2. Semantic search for contractors and census data
3. Integration with LLM for augmenting with retrieved data
"""

import os
import logging
from typing import Dict, List, Any, Optional, Tuple
import json
import re

# Set up logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger("RAG")

# Try to import Chroma, with fallback if not available
try:
    import chromadb
    from chromadb.config import Settings
    
    CHROMA_AVAILABLE = True
except ImportError:
    logger.warning("ChromaDB not available. RAG functionality will be limited.")
    CHROMA_AVAILABLE = False

# Default ChromaDB directory
CHROMA_PERSIST_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "chroma_db")

class RAGEngine:
    """RAG Engine for semantic search and retrieval"""
    
    def __init__(self, persist_dir: Optional[str] = None):
        """Initialize RAG Engine
        
        Args:
            persist_dir: Directory for persistent ChromaDB storage
        """
        self.persist_dir = persist_dir or CHROMA_PERSIST_DIR
        self.client = None
        self.collections = {}
        
        if CHROMA_AVAILABLE:
            self._init_chroma()
    
    def _init_chroma(self):
        """Initialize Chroma client and collections"""
        try:
            # Create persistence directory if it doesn't exist
            os.makedirs(self.persist_dir, exist_ok=True)
            
            # Initialize client
            self.client = chromadb.PersistentClient(
                path=self.persist_dir,
                settings=Settings(anonymized_telemetry=False)
            )
            
            # Initialize collections
            self.collections["contractors"] = self.client.get_or_create_collection(
                name="contractors",
                metadata={"hnsw:space": "cosine"}
            )
            
            self.collections["municipalities"] = self.client.get_or_create_collection(
                name="municipalities",
                metadata={"hnsw:space": "cosine"}
            )
            
            self.collections["census"] = self.client.get_or_create_collection(
                name="census",
                metadata={"hnsw:space": "cosine"}
            )
            
            logger.info(f"Initialized ChromaDB with collections: {list(self.collections.keys())}")
            
            # Log collection sizes
            for name, collection in self.collections.items():
                count = collection.count()
                logger.info(f"Collection '{name}' has {count} documents")
        
        except Exception as e:
            logger.error(f"Failed to initialize ChromaDB: {e}")
            self.client = None
    
    def add_contractor(self, contractor: Dict[str, Any]) -> bool:
        """Add contractor to vector database
        
        Args:
            contractor: Contractor data dictionary
            
        Returns:
            True if successful, False otherwise
        """
        if not CHROMA_AVAILABLE or not self.client:
            logger.warning("ChromaDB not available for adding contractor")
            return False
        
        try:
            # Create a stable ID
            contractor_id = f"contractor:{contractor['name']}:{contractor.get('service_area', 'unknown')}"
            
            # Prepare document text (what will be embedded)
            document = f"{contractor['name']} - {contractor.get('craft_type', '')} in {contractor.get('service_area', 'Unknown')}"
            if contractor.get('address'):
                document += f". Address: {contractor['address']}"
            
            # Clean metadata (Chroma only accepts specific types)
            metadata = {k: v for k, v in contractor.items() if isinstance(v, (str, int, float, bool))}
            metadata["type"] = "contractor"  # Ensure type is set
            
            # Add to collection
            self.collections["contractors"].upsert(
                ids=[contractor_id],
                documents=[document],
                metadatas=[metadata]
            )
            
            logger.info(f"Added contractor to RAG: {contractor['name']}")
            return True
        
        except Exception as e:
            logger.error(f"Failed to add contractor to RAG: {e}")
            return False
    
    def add_municipality(self, municipality: Dict[str, Any]) -> bool:
        """Add municipality to vector database
        
        Args:
            municipality: Municipality data dictionary
            
        Returns:
            True if successful, False otherwise
        """
        if not CHROMA_AVAILABLE or not self.client:
            logger.warning("ChromaDB not available for adding municipality")
            return False
        
        try:
            # Create a stable ID
            municipality_id = f"municipality:{municipality['name']}:{municipality.get('province', 'unknown')}"
            
            # Prepare document text (what will be embedded)
            document = f"{municipality['name']}, {municipality.get('province', 'Canada')}"
            if municipality.get('population'):
                document += f" - Population: {municipality['population']}"
            
            # Clean metadata (Chroma only accepts specific types)
            metadata = {k: v for k, v in municipality.items() if isinstance(v, (str, int, float, bool))}
            metadata["type"] = "municipality"  # Ensure type is set
            
            # Add to collection
            self.collections["municipalities"].upsert(
                ids=[municipality_id],
                documents=[document],
                metadatas=[metadata]
            )
            
            logger.info(f"Added municipality to RAG: {municipality['name']}")
            return True
        
        except Exception as e:
            logger.error(f"Failed to add municipality to RAG: {e}")
            return False
    
    def add_census_data(self, census_data: Dict[str, Any]) -> bool:
        """Add census data to vector database
        
        Args:
            census_data: Census data dictionary
            
        Returns:
            True if successful, False otherwise
        """
        if not CHROMA_AVAILABLE or not self.client:
            logger.warning("ChromaDB not available for adding census data")
            return False
        
        try:
            # Create a stable ID
            location = census_data.get('municipality') or census_data.get('province') or "Canada"
            census_id = f"census:{location}:{census_data.get('year', 'unknown')}"
            
            # Prepare document text (what will be embedded)
            document = f"Census data for {location} ({census_data.get('year', 'recent')})"
            if census_data.get('population'):
                document += f" - Population: {census_data['population']}"
            if census_data.get('housing_units'):
                document += f" - Housing Units: {census_data['housing_units']}"
            if census_data.get('median_income'):
                document += f" - Median Income: ${census_data['median_income']}"
            
            # Clean metadata (Chroma only accepts specific types)
            metadata = {k: v for k, v in census_data.items() if isinstance(v, (str, int, float, bool))}
            metadata["type"] = "census"  # Ensure type is set
            
            # Add to collection
            self.collections["census"].upsert(
                ids=[census_id],
                documents=[document],
                metadatas=[metadata]
            )
            
            logger.info(f"Added census data to RAG: {location}")
            return True
        
        except Exception as e:
            logger.error(f"Failed to add census data to RAG: {e}")
            return False
    
    def query(self, query_text: str, collection_name: Optional[str] = None, limit: int = 10) -> List[Dict[str, Any]]:
        """Query the vector database
        
        Args:
            query_text: Query text
            collection_name: Optional collection name to query (if None, queries all)
            limit: Maximum number of results
            
        Returns:
            List of results with documents and metadata
        """
        if not CHROMA_AVAILABLE or not self.client:
            logger.warning("ChromaDB not available for querying")
            return []
        
        results = []
        try:
            # Query specific collection if provided
            if collection_name and collection_name in self.collections:
                collections_to_query = [self.collections[collection_name]]
            else:
                # Query all collections
                collections_to_query = list(self.collections.values())
            
            # Execute queries
            for collection in collections_to_query:
                try:
                    response = collection.query(
                        query_texts=[query_text],
                        n_results=limit
                    )
                    
                    # Process results
                    if response and response.get("documents") and response.get("metadatas"):
                        docs = response["documents"][0]
                        metadatas = response["metadatas"][0]
                        ids = response["ids"][0]
                        
                        for i in range(len(docs)):
                            results.append({
                                "id": ids[i],
                                "document": docs[i],
                                "metadata": metadatas[i],
                                "collection": collection.name
                            })
                
                except Exception as e:
                    logger.error(f"Error querying collection {collection.name}: {e}")
            
            # Sort by relevance (currently just preserving original order)
            return results
        
        except Exception as e:
            logger.error(f"Failed to query RAG: {e}")
            return []
    
    def get_context_for_llm(self, query_text: str, max_tokens: int = 2000) -> str:
        """Get context from RAG for LLM processing
        
        Args:
            query_text: Query text
            max_tokens: Maximum context tokens to return
            
        Returns:
            Context string for LLM
        """
        results = self.query(query_text, limit=15)
        
        if not results:
            return "No relevant context found in the database."
        
        # Build context string with metadata
        context_parts = []
        for result in results:
            metadata = result.get("metadata", {})
            entity_type = metadata.get("type", "unknown")
            
            if entity_type == "contractor":
                # Format contractor data
                context_parts.append(
                    f"Contractor: {metadata.get('name', 'Unknown')}\n"
                    f"Service Area: {metadata.get('service_area', 'Unknown')}\n"
                    f"Type: {metadata.get('craft_type', 'Unknown')}\n"
                    f"Phone: {metadata.get('phone', 'N/A')}\n"
                    f"Email: {metadata.get('email', 'N/A')}\n"
                    f"Website: {metadata.get('website', 'N/A')}\n"
                    f"Address: {metadata.get('address', 'N/A')}\n"
                    f"Score: {metadata.get('score', 'N/A')}\n"
                )
            
            elif entity_type == "municipality":
                # Format municipality data
                context_parts.append(
                    f"Municipality: {metadata.get('name', 'Unknown')}\n"
                    f"Province: {metadata.get('province', 'Unknown')}\n"
                    f"Population: {metadata.get('population', 'Unknown')}\n"
                )
            
            elif entity_type == "census":
                # Format census data
                location = metadata.get('municipality') or metadata.get('province') or "Location"
                context_parts.append(
                    f"Census Data for {location}:\n"
                    f"Year: {metadata.get('year', 'Unknown')}\n"
                    f"Population: {metadata.get('population', 'Unknown')}\n"
                    f"Housing Units: {metadata.get('housing_units', 'Unknown')}\n"
                    f"Median Income: ${metadata.get('median_income', 'Unknown')}\n"
                )
        
        # Join all context parts
        context = "\n---\n".join(context_parts)
        
        # Truncate if too long (approximate token estimation)
        if len(context) > max_tokens * 4:  # Rough estimate: 4 chars per token
            context = context[:max_tokens * 4] + "...(truncated)"
        
        return context
    
    def get_graph_data(self, query_text: Optional[str] = None) -> Dict[str, List[Dict[str, Any]]]:
        """Get data for graph visualization
        
        Args:
            query_text: Optional query to filter results
            
        Returns:
            Dictionary with nodes and edges lists
        """
        nodes = []
        edges = []
        
        if not CHROMA_AVAILABLE or not self.client:
            logger.warning("ChromaDB not available for graph data")
            return {"nodes": nodes, "edges": edges}
        
        try:
            # Get all relevant entities
            if query_text:
                results = self.query(query_text, limit=50)
                
                # Process query results
                for result in results:
                    metadata = result.get("metadata", {})
                    entity_type = metadata.get("type", "unknown")
                    
                    # Add node
                    node_id = result.get("id", f"node_{len(nodes)}")
                    nodes.append({
                        "id": node_id,
                        "label": metadata.get("name", "Unknown"),
                        "type": entity_type,
                        "data": metadata
                    })
            
            else:
                # Without query, get some samples from each collection
                for collection_name, collection in self.collections.items():
                    try:
                        # Get all items for small collections, or sample for large ones
                        count = collection.count()
                        if count > 0:
                            all_ids = collection.get(limit=min(50, count))
                            
                            for i, item_id in enumerate(all_ids.get("ids", [])):
                                metadata = all_ids["metadatas"][i] if all_ids.get("metadatas") else {}
                                document = all_ids["documents"][i] if all_ids.get("documents") else ""
                                
                                # Add node
                                node_type = metadata.get("type", collection_name)
                                nodes.append({
                                    "id": item_id,
                                    "label": metadata.get("name", f"Item {i}"),
                                    "type": node_type,
                                    "data": metadata
                                })
                    
                    except Exception as e:
                        logger.error(f"Error getting items from collection {collection_name}: {e}")
            
            # Generate edges based on relationships
            # Connect municipalities to provinces
            municipality_nodes = [n for n in nodes if n.get("type") == "municipality"]
            province_nodes = [n for n in nodes if n.get("type") == "province"]
            
            for m_node in municipality_nodes:
                province = m_node.get("data", {}).get("province")
                if province:
                    matching_provinces = [p for p in province_nodes if p.get("data", {}).get("name") == province]
                    
                    if matching_provinces:
                        edges.append({
                            "source": m_node["id"],
                            "target": matching_provinces[0]["id"],
                            "label": "located_in"
                        })
            
            # Connect contractors to service areas
            contractor_nodes = [n for n in nodes if n.get("type") == "contractor"]
            
            for c_node in contractor_nodes:
                service_area = c_node.get("data", {}).get("service_area")
                if service_area:
                    matching_areas = [m for m in municipality_nodes if m.get("data", {}).get("name") == service_area]
                    
                    if matching_areas:
                        edges.append({
                            "source": c_node["id"],
                            "target": matching_areas[0]["id"],
                            "label": "serves"
                        })
            
            return {"nodes": nodes, "edges": edges}
        
        except Exception as e:
            logger.error(f"Failed to get graph data: {e}")
            return {"nodes": nodes, "edges": edges}
    
    def get_stats(self) -> Dict[str, Any]:
        """Get statistics about the RAG database
        
        Returns:
            Dictionary with statistics
        """
        stats = {
            "available": CHROMA_AVAILABLE and self.client is not None,
            "collections": {},
            "total_documents": 0
        }
        
        if not CHROMA_AVAILABLE or not self.client:
            return stats
        
        try:
            for name, collection in self.collections.items():
                count = collection.count()
                stats["collections"][name] = count
                stats["total_documents"] += count
            
            return stats
        
        except Exception as e:
            logger.error(f"Failed to get RAG stats: {e}")
            return stats