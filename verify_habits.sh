#!/bin/bash

BASE_URL="http://localhost:5000/api"

echo "=== VERIFICATION: HABIT TRACKER & AI MENTOR ==="

# 1. Login as Student
echo -e "\n1. Logging in as Student..."
STUDENT_TOKEN=$(curl -s -X POST $BASE_URL/auth/login -H "Content-Type: application/json" -d '{"username":"student_test","password":"password123"}' | grep -o '"token":"[^"]*' | cut -d'"' -f4)

if [ -z "$STUDENT_TOKEN" ]; then
  echo "Login failed. Ensure server is running and user exists."
  exit 1
fi
echo "Student Token Acquired."

# 2. Create Student Log
echo -e "\n2. Creating Daily Log..."
LOG_RESPONSE=$(curl -s -X POST $BASE_URL/student-logs -H "Content-Type: application/json" -H "Authorization: Bearer $STUDENT_TOKEN" -d '{"hours":5, "mood":"Productive", "goals":"Learn React Hooks"}')
echo "Response: $LOG_RESPONSE"

# 3. Get Logs
echo -e "\n3. Fetching Logs..."
curl -s -X GET $BASE_URL/student-logs -H "Authorization: Bearer $STUDENT_TOKEN" | grep "Learn React Hooks" && echo "Verified: Log found."

# 4. Request AI Analysis (Mock check if no API key)
echo -e "\n4. Requesting AI Analysis..."
ANALYSIS_RESPONSE=$(curl -s -X POST $BASE_URL/student-logs/analyze -H "Authorization: Bearer $STUDENT_TOKEN")
echo "Response (truncated): ${ANALYSIS_RESPONSE:0:100}..."

echo -e "\n=== DONE ==="
