from os_connect import client
from os_connect import index_name
from typing import List



def get_unique_categories(size: int = 10000) -> List[str]:
    
    # Define the aggregation query
    unique_categories = set()
    query = search_query = {
        "_source": ["categories"],  # Retrieve only the 'categories' field
        "size": 10000  # Adjust the size as needed
    }

    try:
        response = client.search(index=index_name, body=search_query)#. scroll='2m')  # Use scrolling for large datasets

        scroll_id = response['_scroll_id']
        while True:
            hits = response['hits']['hits']
            if not hits:
                break

            # Step 2: Process each document
            for hit in hits:
                document = hit['_source']
                categories = document.get('categories', [])
                unique_categories.update(categories)

            # Fetch the next batch of documents
            response = client.scroll(scroll_id=scroll_id, scroll='2m')

        # Clear the scroll context
        client.clear_scroll(scroll_id=scroll_id)
        
        # Convert the set to a list
        return list(unique_categories)

    except Exception as e:
        print(f"Error occurred: {e}")
        return []


def get_unique_categories_and_count(size: int = 10000) -> tuple[List[str], int]:

    # Define the aggregation query
    query ={
        "size": 0,
        "aggs": {
            "unique_categories": {
                "composite": {
                    "sources": [
                        {
                            "category": {
                                "terms": {
                                    "field": "categories.keyword",
                                    "size": size  # Adjust size parameter for the number of unique categories
                                }
                            }
                        }
                    ]
                }
            }
        }
    }

    try:
        # Execute the search query
        response = client.search(index=index_name, body=query)
        
        # Extract unique categories from the response
        buckets = response['aggregations']['unique_categories']['buckets']
        unique_categories = [bucket['key']['category'] for bucket in buckets]
        category_count = len(unique_categories)
        print(category_count)
        # Return the list of unique categories and their count
        return unique_categories, category_count

    except Exception as e:
        print(f"Error occurred: {e}")
        return [], 0
