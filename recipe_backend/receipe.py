from flask import jsonify
from opensearchpy import NotFoundError
import requests
import json
import os_connect

def get_document_by_id(doc_id):
    """
    Fetch a document by its ID from Opensearch.

    :param doc_id: The ID of the document to retrieve.
    :return: The details of the document if found, otherwise an empty dictionary.
    """
    try:
        response = os_connect.client.get(
            index=os_connect.index_name,
            id=doc_id
        )
        # Extract the source from the response
        source = response.get('_source', {})

        # Format the result
        result = {
            "id": doc_id,
            "title": source.get('title', ''),
            "description": source.get('desc', ''),
            "ingredients": source.get('ingredients', []),
            "directions": source.get('directions', []),
            "categories": source.get('categories', []),
            "calories": source.get('calories', 0),
            "fat": source.get('fat', 0),
            "protein": source.get('protein', 0),
            "sodium": source.get('sodium', 0),
            "rating": source.get('rating', 0.0),
            "date": source.get('date', '')
        }

        return result

    except Exception as e:
        # Handle exceptions (e.g., document not found)
        print(f"Error retrieving document with ID {doc_id}: {e}")
        return {}
