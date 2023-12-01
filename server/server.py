import os
from pymongo import MongoClient
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)


def get_database():
    connection_string = "mongodb+srv://aaronle5621:H372yQatE1xYIFjE@nextdata.5z7ay5h.mongodb.net/?retryWrites=true&w=majority"
    if not connection_string:
        raise ValueError(
            "MongoDB connection string not found in environment variables."
        )

    try:
        client = MongoClient(connection_string)
        print("Connection to MongoDB successful!")
        return client["nextdata"]
    except Exception as e:
        print(f"Error connecting to MongoDB: {e}")
        raise


def get_documents():
    try:
        dbname = get_database()
        collection = dbname["technext"]
        results = collection.find({})
        return results
    except Exception as e:
        print(f"Error retrieving documents from MongoDB: {e}")
        raise


@app.route("/api/documents", methods=["GET"])
def document_api():
    try:
        documents = get_documents()
        documentList = []
        for doc in documents:
            doc_info = {
                "id": doc["idx"],
                "id2": doc["idx_2"],
                "patent_id": doc["patent_id"],
                "patent_text": doc["patent_text"],
                "phase": doc["phase"],
                "date": doc["date"],
            }
            documentList.append(doc_info)
        return jsonify(documentList)
    except Exception as e:
        print(f"Error processing documents: {e}")
        return jsonify({"error": "Internal Server Error"}), 500


if __name__ == "__main__":
    app.run(debug=True)
