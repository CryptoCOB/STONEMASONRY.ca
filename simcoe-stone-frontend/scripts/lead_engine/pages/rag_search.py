"""
RAG Search Page

Query the vector store and inspect results.
"""

import os
import sys
import streamlit as st

current_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if current_dir not in sys.path:
    sys.path.insert(0, current_dir)

from ui.streamlit_components import render_page_header, render_card

try:
    from modules.data.rag import RAGEngine
    RAG_OK = True
except Exception as e:
    RAG_OK = False
    RAG_ERR = str(e)


def render_rag_search_page():
    render_page_header("RAG Search", "Semantic search over stored content", "🔎")

    if not RAG_OK:
        st.error("RAG engine not available")
        st.code(RAG_ERR)
        return

    rag = RAGEngine()

    col1, col2 = st.columns([3, 1])
    with col1:
        query = st.text_input("Ask a question", placeholder="e.g., stonemason in Toronto with website")
    with col2:
        top_k = st.number_input("Top K", min_value=1, max_value=20, value=5)

    if st.button("Search", type="primary") and query:
        with st.spinner("Querying vector store..."):
            results = rag.query(query, top_k=top_k)
        if not results:
            st.info("No results")
        else:
            for i, item in enumerate(results, 1):
                with st.expander(f"Result #{i}: {item.get('name', 'Unknown')}"):
                    st.json(item)

    st.subheader("Collections")
    stats = rag.get_stats()
    st.json(stats)
