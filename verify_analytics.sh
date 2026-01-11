#!/bin/bash

BASE_URL="http://localhost:5000/api"

echo "=== VERIFICATION: ANALYTICS & PATTERN RECOGNITION ==="

# 1. Login as Student
echo -e "\n1. Logging in as Student..."
STUDENT_TOKEN=$(curl -s -X POST $BASE_URL/auth/login -H "Content-Type: application/json" -d '{"username":"student_test","password":"password123"}' | grep -o '"token":"[^"]*' | cut -d'"' -f4)

# 2. Create Log ONLY if it doesn't duplicate today's (avoid unique constraint if using date index, though current schema allows multiple logs per day, we assume one)
echo -e "\n2. Creating Student Log with Reflection..."
curl -s -X POST $BASE_URL/student-logs \
  -H "Authorization: Bearer $STUDENT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"hours":2, "mood":"Tired", "goals":"Finish Science", "reflection":"Feeling a bit overwhelmed today by the workload."}' \
  | grep "createdAt" && echo "Log Created."

# 3. Simulate Early Warning (This will likely show 0 drop if not enough data, but verifies route works)
echo -e "\n3. Testing Early Warning System..."
WARNING_RES=$(curl -s -X POST $BASE_URL/analytics/early-warning \
  -H "Authorization: Bearer $STUDENT_TOKEN")
echo "Response: $WARNING_RES"

# 4. Login as Teacher
echo -e "\n4. Logging in as Teacher..."
TEACHER_TOKEN=$(curl -s -X POST $BASE_URL/auth/login -H "Content-Type: application/json" -d '{"username":"teacher_test","password":"password123"}' | grep -o '"token":"[^"]*' | cut -d'"' -f4)

# 5. Get Analytics (Teacher)
echo -e "\n5. Fetching Class Analytics..."
STATS=$(curl -s -X GET $BASE_URL/analytics/teacher/ClassA -H "Authorization: Bearer $TEACHER_TOKEN")
echo "Analytics Data: ${STATS:0:150}..." # Truncate output

echo -e "\n=== DONE ==="
