"""
Test script for the RAG module
"""

import os
import sys
import json
from modules.data.rag import RAGEngine

def main():
    """Main test function"""
    print("Testing RAG Module...")
    
    # Initialize RAG engine
    rag = RAGEngine()
    
    # Print stats
    stats = rag.get_stats()
    print(f"RAG Stats: {json.dumps(stats, indent=2)}")
    
    # Add test contractor
    test_contractor = {
        "name": "Test Contractor",
        "service_area": "Toronto",
        "craft_type": "stonemason",
        "phone": "416-555-1234",
        "email": "test@example.com",
        "website": "https://example.com",
        "address": "123 Test St, Toronto, ON",
        "score": 8
    }
    
    success = rag.add_contractor(test_contractor)
    print(f"Added test contractor: {success}")
    
    # Query for the contractor
    results = rag.query("stonemason in Toronto")
    print(f"Query results: {len(results)} found")
    
    if results:
        print(f"First result: {json.dumps(results[0], indent=2)}")
    
    # Get context for LLM
    context = rag.get_context_for_llm("Find masonry contractors in Toronto")
    print(f"LLM Context: {context[:200]}...")  # Show first 200 chars
    
    # Get graph data
    graph = rag.get_graph_data("Toronto")
    print(f"Graph data: {len(graph['nodes'])} nodes, {len(graph['edges'])} edges")

if __name__ == "__main__":
    main()