from flask import jsonify
from opensearchpy import NotFoundError
import requests
import json
from os_connect import client
from os_connect import index_name


def search_recipes(query, filters):
    
    opensearch_query = {
        "size": 1000,  
        "query": { 
            "bool": {
                "must": [],
                "filter": []
            }
        }
    }

    
    if query:
        opensearch_query["query"]["bool"]["must"].append({
            "match": {
                "title": query
            }
        })

    
    if 'categories' in filters and filters['categories']:
        categories = [value for key, value in filters['categories'].items()]
        opensearch_query["query"]["bool"]["filter"].append({
            "terms": {
                "categories": categories
            }
        })

    if 'proteins' in filters:
        opensearch_query["query"]["bool"]["filter"].append({
            "range": {
                "protein": {
                    "gte": float(filters['proteins'].get('0', 0)),
                    "lte": float(filters['proteins'].get('1', 100))
                }
            }
        })

    if 'fat' in filters:
        opensearch_query["query"]["bool"]["filter"].append({
            "range": {
                "fat": {
                    "gte": float(filters['fat'].get('0', 0)),
                    "lte": float(filters['fat'].get('1', 50))
                }
            }
        })

    if 'sodium' in filters:
        opensearch_query["query"]["bool"]["filter"].append({
            "range": {
                "sodium": {
                    "gte": float(filters['sodium'].get('0', 0)),
                    "lte": float(filters['sodium'].get('1', 2000))
                }
            }
        })

    if 'calories' in filters:
        opensearch_query["query"]["bool"]["filter"].append({
            "range": {
                "calories": {
                    "gte": float(filters['calories'].get('0', 0)),
                    "lte": float(filters['calories'].get('1', 2000))
                }
            }
        })

    if 'rating' in filters:
        rating_values = [float(key) for key, value in filters['rating'].items() if value == 'true']
        if rating_values:
            opensearch_query["query"]["bool"]["filter"].append({
                "range": {
                    "rating": {
                        "gte": min(rating_values)
                    }
                }
            })

    
    try:
        response = client.search(
            body=opensearch_query,
            index=index_name
        )
        hits = response.get('hits', {}).get('hits', [])
        results = []
        for hit in hits:
            source = hit.get('_source', {})
            formatted_result = {
                "id": hit.get('_id'),
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
            results.append(formatted_result)
        return results
    except Exception as e:
        print(f"An error occurred: {e}")
        return None



def os_title_search(q=""):
    # print("hi")
    query = {
    'size': 10,
    'query': {
        'multi_match': {
        'query': q,
        'fields': ['title']
        }
    }
    }
    response = client.search(
        body = query,
        index = index_name
    )
    # print('\nSearch results:')
    # print(response)
    hits = response.get('hits', {}).get('hits', [])

    # Format the results
    results = []
    for hit in hits:
        source = hit.get('_source', {})
        formatted_result = {
            "id": hit.get('_id'),
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
        results.append(formatted_result)

    # Print results for debugging
    # print('\nSearch results:')
    print(len(results))

    # Return the results (you might want to return this as JSON in a real web application)
    return results


def get_suggestions(query, search_by):
    try:
        response = client.ping()
        if response:
            print("Connection successful")
        else:
            print("Connection failed")
    except Exception as e:
        print("Error:", e)
    allowed_fields = ['title', 'categories', 'ingredients']
    if search_by not in allowed_fields:
        return {"error": "Invalid searchBy parameter"}, 400

    search_body = {
        "query": {
            "multi_match": {
                "query": query,
                "fields": [f"{search_by}^2"]
            }
        },
        "size": 10
    }

    try:
        response = client.search(index=index_name, body=search_body)
        print("OpenSearch response:", response)

        suggestions = []
        for hit in response['hits']['hits']:
            source = hit['_source']
            if search_by in source:
                if isinstance(source[search_by], list):
                    suggestions.extend(source[search_by])
                else:
                    suggestions.append(source[search_by])
        
        if search_by == 'categories':
            suggestions = list(set(suggestions))  
        
        return suggestions, 200

    except NotFoundError:
        return {"error": "Index not found"}, 404
    except Exception as e:
        print("Error:", e)
        return {"error": "An error occurred while fetching suggestions"}, 500
    
#scroll search for top rated 
def top_rated_recipes(page,size):   
    query = {
        'from': (page - 1) * size,  # Calculate the offset
        'size': size,
        'query': {
            'range': {
                'rating': {
                    'gt': 4  
                }
            }
        }
    }
    
    try:
        response = client.search(
            body=query,
            index=index_name
        )
        hits = response.get('hits', {}).get('hits', [])
        results = []
        for hit in hits:
            source = hit.get('_source', {})
            formatted_result = {
                "id": hit.get('_id'),
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
            results.append(formatted_result)
            if not all(isinstance(item, dict) for item in results):
                raise TypeError("One or more items in the results list are not dictionaries")
        return results
    except Exception as e:
        print(f"An error occurred: {e}")
        return []  

#search for top rated without scroll
def os_top_rated_recipes():
    query = {
        'size': 10,
        'query': {
            'range': {
                'rating': {
                    'gt': 4  # Greater than 4
                }
            }
        }
    }
    
    response = client.search(
        body=query,
        index=index_name
    )
    
    hits = response.get('hits', {}).get('hits', [])

    # Format the results
    results = []
    for hit in hits:
        source = hit.get('_source', {})
        formatted_result = {
            "id": hit.get('_id'),
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
        results.append(formatted_result)

    # Print results for debugging
    print(len(results))

    # Return the results (you might want to return this as JSON in a real web application)
    return results

#search with filters and recipe
# def search_recipes():
#     query = request.args.get('search', '')
#     page = int(request.args.get('page', 1))
#     size = int(request.args.get('size', 10))
#     filters = parse_filters(request.args)
    
#     # Adjust the query to support pagination
#     opensearch_query = {
#         "from": (page - 1) * size,  # Calculate the offset
#         "size": size,
#         "query": {
#             "bool": {
#                 "must": [],
#                 "filter": []
#             }
#         }
#     }

#     if query:
#         opensearch_query["query"]["bool"]["must"].append({
#             "match": {
#                 "title": query
#             }
#         })

#     # Add filters to the query (same as before)
#     if 'categories' in filters and filters['categories']:
#         categories = [value for key, value in filters['categories'].items()]
#         opensearch_query["query"]["bool"]["filter"].append({
#             "terms": {
#                 "categories": categories
#             }
#         })

#     if 'proteins' in filters:
#         opensearch_query["query"]["bool"]["filter"].append({
#             "range": {
#                 "protein": {
#                     "gte": float(filters['proteins'].get('0', 0)),
#                     "lte": float(filters['proteins'].get('1', 100))
#                 }
#             }
#         })

#     if 'fat' in filters:
#         opensearch_query["query"]["bool"]["filter"].append({
#             "range": {
#                 "fat": {
#                     "gte": float(filters['fat'].get('0', 0)),
#                     "lte": float(filters['fat'].get('1', 50))
#                 }
#             }
#         })

#     if 'sodium' in filters:
#         opensearch_query["query"]["bool"]["filter"].append({
#             "range": {
#                 "sodium": {
#                     "gte": float(filters['sodium'].get('0', 0)),
#                     "lte": float(filters['sodium'].get('1', 2000))
#                 }
#             }
#         })

#     if 'calories' in filters:
#         opensearch_query["query"]["bool"]["filter"].append({
#             "range": {
#                 "calories": {
#                     "gte": float(filters['calories'].get('0', 0)),
#                     "lte": float(filters['calories'].get('1', 2000))
#                 }
#             }
#         })

#     if 'rating' in filters:
#         rating_values = [float(key) for key, value in filters['rating'].items() if value == 'true']
#         if rating_values:
#             opensearch_query["query"]["bool"]["filter"].append({
#                 "range": {
#                     "rating": {
#                         "gte": min(rating_values)
#                     }
#                 }
#             })

#     try:
#         response = client.search(
#             body=opensearch_query,
#             index=index_name
#         )
#         hits = response.get('hits', {}).get('hits', [])
#         results = []
#         for hit in hits:
#             source = hit.get('_source', {})
#             formatted_result = {
#                 "id": hit.get('_id'),
#                 "title": source.get('title', ''),
#                 "description": source.get('desc', ''),
#                 "ingredients": source.get('ingredients', []),
#                 "directions": source.get('directions', []),
#                 "categories": source.get('categories', []),
#                 "calories": source.get('calories', 0),
#                 "fat": source.get('fat', 0),
#                 "protein": source.get('protein', 0),
#                 "sodium": source.get('sodium', 0),
#                 "rating": source.get('rating', 0.0),
#                 "date": source.get('date', '')
#             }
#             results.append(formatted_result)
#         return jsonify(results)
#     except Exception as e:
#         print(f"An error occurred: {e}")
#         return jsonify([]) 