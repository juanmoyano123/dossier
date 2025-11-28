from flask import Flask, request, jsonify
from flask_cors import CORS
import googlemaps
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

app = Flask(__name__)
# Enable CORS for all routes - permissive for development
CORS(app)

# Initialize Google Maps client
api_key = os.getenv('GOOGLE_MAPS_API_KEY')
gmaps = None

if api_key and api_key != 'your_api_key_here':
    try:
        gmaps = googlemaps.Client(key=api_key)
        print("✓ Google Maps API initialized successfully")
    except Exception as e:
        print(f"⚠ Warning: Could not initialize Google Maps API: {e}")
else:
    print("⚠ Warning: GOOGLE_MAPS_API_KEY not configured. API calls will fail.")

@app.route('/api/search', methods=['POST'])
def search_businesses():
    """
    Search for businesses using Google Maps Places API

    Expected JSON body:
    {
        "location": "Hickory, NC",
        "radius": 10,
        "category": "pool services"
    }
    """
    try:
        if gmaps is None:
            return jsonify({
                'error': 'Google Maps API not configured. Please set GOOGLE_MAPS_API_KEY in .env file'
            }), 503

        data = request.json
        location = data.get('location')
        radius = data.get('radius', 10)  # Default 10 miles
        category = data.get('category')

        if not location or not category:
            return jsonify({
                'error': 'location and category are required'
            }), 400

        # Convert miles to meters (Google API uses meters)
        radius_meters = int(radius * 1609.34)

        # Step 1: Geocode the location to get lat/lng
        geocode_result = gmaps.geocode(location)
        if not geocode_result:
            return jsonify({
                'error': f'Could not find location: {location}'
            }), 404

        lat_lng = geocode_result[0]['geometry']['location']

        # Step 2: Search for places using Text Search
        # This is more flexible than Nearby Search for category-based queries
        query = f"{category} near {location}"

        places_result = gmaps.places(
            query=query,
            location=lat_lng,
            radius=radius_meters
        )

        businesses = []

        if places_result and 'results' in places_result:
            # Step 3: Get details for each place
            for place in places_result['results'][:50]:  # Limit to 50 results
                place_id = place.get('place_id')

                # Get detailed information for this place
                details = gmaps.place(
                    place_id=place_id,
                    fields=[
                        'name',
                        'formatted_address',
                        'formatted_phone_number',
                        'website',
                        'rating',
                        'user_ratings_total'
                    ]
                )

                if details and 'result' in details:
                    result = details['result']
                    businesses.append({
                        'name': result.get('name', 'N/A'),
                        'address': result.get('formatted_address', 'N/A'),
                        'phone': result.get('formatted_phone_number', 'N/A'),
                        'website': result.get('website', None),
                        'rating': result.get('rating', None),
                        'review_count': result.get('user_ratings_total', 0)
                    })

        return jsonify({
            'businesses': businesses,
            'total': len(businesses)
        })

    except googlemaps.exceptions.ApiError as e:
        return jsonify({
            'error': f'Google Maps API error: {str(e)}'
        }), 500
    except Exception as e:
        return jsonify({
            'error': str(e)
        }), 500


@app.route('/api/export', methods=['POST'])
def export_to_sheets():
    """
    Export businesses to Google Sheets

    Expected JSON body:
    {
        "businesses": [
            { "name": "...", "address": "...", ... }
        ]
    }
    """
    try:
        data = request.json
        businesses = data.get('businesses', [])

        if not businesses:
            return jsonify({
                'error': 'No businesses to export'
            }), 400

        # TODO: Implement Google Sheets export
        # This will be implemented in Day 3

        return jsonify({
            'sheet_url': 'https://docs.google.com/spreadsheets/d/example',
            'message': 'Export functionality coming soon (Day 3)'
        })

    except Exception as e:
        return jsonify({
            'error': str(e)
        }), 500


@app.route('/health', methods=['GET'])
def health_check():
    """Simple health check endpoint"""
    return jsonify({'status': 'ok', 'api': 'Google Maps API'})


if __name__ == '__main__':
    app.run(debug=True, port=5001)
