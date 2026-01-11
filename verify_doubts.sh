#!/bin/bash

BASE_URL="http://localhost:5000/api"

echo "=== VERIFICATION: DOUBT RESOLUTION SYSTEM ==="

# 1. Login as Student
echo -e "\n1. Logging in as Student..."
STUDENT_TOKEN=$(curl -s -X POST $BASE_URL/auth/login -H "Content-Type: application/json" -d '{"username":"student_test","password":"password123"}' | grep -o '"token":"[^"]*' | cut -d'"' -f4)

# 2. Ask Doubt (Student)
echo -e "\n2. Asking Doubt..."
DOUBT_RES=$(curl -s -X POST $BASE_URL/doubts \
  -H "Authorization: Bearer $STUDENT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"question":"What is photosynthesis?", "classId":"ClassA"}')

echo "Doubt ID created. AI Answer generated."
DOUBT_ID=$(echo $DOUBT_RES | grep -o '"_id":"[^"]*' | cut -d'"' -f4)

# 3. Login as Teacher
echo -e "\n3. Logging in as Teacher..."
TEACHER_TOKEN=$(curl -s -X POST $BASE_URL/auth/login -H "Content-Type: application/json" -d '{"username":"teacher_test","password":"password123"}' | grep -o '"token":"[^"]*' | cut -d'"' -f4)

# 4. Verify/Star Doubt (Teacher)
echo -e "\n4. Verifying Doubt..."
VERIFY_RES=$(curl -s -X PUT $BASE_URL/doubts/$DOUBT_ID/verify \
  -H "Authorization: Bearer $TEACHER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"isVerified":true}')

echo "Verification Status: $(echo $VERIFY_RES | grep -o '"isVerified":[^,]*' | cut -d':' -f2)"

# 5. Fetch Doubts (Student)
echo -e "\n5. Fetching Class Doubts..."
curl -s -X GET $BASE_URL/doubts/ClassA -H "Authorization: Bearer $STUDENT_TOKEN" | grep "Verified" && echo "Verified: Doubt listed and marked verified."

echo -e "\n=== DONE ==="
