from flask import Flask, jsonify, request
from flask_cors import CORS
from pymongo import MongoClient
from pymongo.server_api import ServerApi

app = Flask(__name__)
CORS(app)


def convert_document(document):
    # Convert ObjectId to string in the document
    document["_id"] = str(document["_id"])
    return document


def get_database():
    uri = "mongodb+srv://aaronle5621:H372yQatE1xYIFjE@nextdata.5z7ay5h.mongodb.net/TechNext?retryWrites=true&w=majority"
    client = MongoClient(uri, server_api=ServerApi("1"))
    print("Connection to MongoDB successful!")
    return client["TechNext"]


def get_documents():
    dbname = get_database()
    collection = dbname["nextdata"]
    results = collection.find({})
    return results


@app.route("/api/documents", methods=["GET"])
def document_api():
    try:
        page = request.args.get("page", default=1, type=int)
        per_page = request.args.get("per_page", default=10, type=int)
        skip = (page - 1) * per_page
        documents = get_documents().skip(skip).limit(per_page)
        document_list = [convert_document(doc) for doc in documents]
        return jsonify(document_list)
    except Exception as e:
        print(f"Error processing documents: {e}")
        return jsonify({"error": "Internal Server Error"}), 500


@app.route("/api/search", methods=["GET"])
def search_api():
    try:
        query = request.args.get("query")

        dbname = get_database()
        collection = dbname["nextdata"]

        # Use a regex pattern for case-insensitive search on multiple fields
        results = collection.find(
            {
                "$or": [
                    {"_id": {"$regex": query, "$options": "i"}},
                    {"Date": {"$regex": query, "$options": "i"}},
                    {"idx": {"$regex": query, "$options": "i"}},
                    {"patent_id": {"$regex": query, "$options": "i"}},
                    {"patent_text": {"$regex": query, "$options": "i"}},
                    {"phase": {"$regex": query, "$options": "i"}},
                ]
            }
        )

        search_results = [convert_document(doc) for doc in results]
        return jsonify(search_results)
    except Exception as e:
        print(f"Error processing search: {e}")
        return jsonify({"error": "Internal Server Error"}), 500


if __name__ == "__main__":
    app.run(debug=True)
