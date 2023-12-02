from flask import Flask, jsonify
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
        documents = get_documents()
        # Convert each document's ObjectId to string
        document_list = [convert_document(doc) for doc in documents]
        print(document_list[0])  # Test print the first item
        return jsonify(document_list)
    except Exception as e:
        print(f"Error processing documents: {e}")
        return jsonify({"error": "Internal Server Error"}), 500


if __name__ == "__main__":
    app.run(debug=True)
