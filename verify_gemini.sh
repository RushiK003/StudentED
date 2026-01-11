#!/bin/bash
BASE_URL="http://localhost:5000/api"

echo "=== GEMINI MIGRATION CHECK ==="

# 1. Login
echo "Logging in..."
TOKEN=$(curl -s -X POST $BASE_URL/auth/login -H "Content-Type: application/json" -d '{"username":"student_test","password":"password123"}' | grep -o '"token":"[^"]*' | cut -d'"' -f4)

if [ -z "$TOKEN" ]; then
  echo "Login Failed. Ensure server is running."
  exit 1
fi

echo "Token Acquired."

# 2. Test Gemini Mentor Advice
echo -e "\nTesting Mentor Advice (Gemini)..."
curl -s -X POST $BASE_URL/ai/mentor-advice \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json"

echo -e "\n\n=== CHECK COMPLETE (If you see advice text above, it works!) ==="
