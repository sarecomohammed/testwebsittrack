# Testing Guide - Tracking System Rebuild

## 🧪 How to Test the New Tracking System

This guide will help you verify that the company isolation and new tracking system work correctly.

---

## Prerequisites

Before testing, ensure you have:
- ✅ At least 2 user accounts (Company A and Company B)
- ✅ At least 1 shipment for each company
- ✅ Access to the dashboard and settings page

---

## Test 1: Settings Page Simplification ✅

### Objective
Verify that the settings page is clean and shows only the necessary tracking widget code.

### Steps
1. Log in to any company account
2. Navigate to **Dashboard → Settings**
3. Scroll through the page

### Expected Results
✅ Should see these sections in order:
   1. Company Profile
   2. Current Plan
   3. **Tracking Widget for Your Website** (main section)
   4. API Key (if Pro plan)

✅ Tracking Widget section should contain:
   - Company ID displayed clearly
   - Copy button for Company ID
   - Option 1: Inline Search Box with preview link
   - Option 2: Modal Popup Button with preview link
   - Key Features box (yellow)
   - Security & Privacy box (green)

❌ Should NOT see:
   - "Active Tracking Numbers" section
   - Old "Embed Code" section
   - "JavaScript Widget Example" section
   - List of individual shipments

---

## Test 2: Company Isolation (Critical Security Test) 🔒

### Objective
Verify that customers can ONLY see shipments from their own company.

### Setup
1. Create **Company A** account
   - Note the Company ID (userId)
   - Create a shipment with tracking number: `TKS-COMP-A-001`

2. Create **Company B** account
   - Note the Company ID (userId)
   - Create a shipment with tracking number: `TKS-COMP-B-001`

### Test Cases

#### Test 2.1: Company A tracking Company A's shipment ✅
```
Request: /api/track?trackingNumber=TKS-COMP-A-001&userId=COMPANY_A_ID
Expected: ✅ Returns shipment data
```

**Steps:**
1. Open: `http://localhost:3000/embed/search?userId=COMPANY_A_ID`
2. Enter tracking number: `TKS-COMP-A-001`
3. Click "Track Shipment"

**Expected Result:**
- ✅ Shows shipment details
- ✅ Shows Company A's name
- ✅ Shows customer name
- ✅ Shows tracking timeline

---

#### Test 2.2: Company A trying to track Company B's shipment ❌
```
Request: /api/track?trackingNumber=TKS-COMP-B-001&userId=COMPANY_A_ID
Expected: ❌ Returns "Shipment not found"
```

**Steps:**
1. Open: `http://localhost:3000/embed/search?userId=COMPANY_A_ID`
2. Enter tracking number: `TKS-COMP-B-001` (Company B's tracking number)
3. Click "Track Shipment"

**Expected Result:**
- ❌ Shows error: "Shipment not found. Please check your tracking number and try again."
- ❌ Does NOT show Company B's shipment data
- ✅ Company B's data remains private

**This is the CRITICAL security test!**

---

#### Test 2.3: Company B tracking Company B's shipment ✅
```
Request: /api/track?trackingNumber=TKS-COMP-B-001&userId=COMPANY_B_ID
Expected: ✅ Returns shipment data
```

**Steps:**
1. Open: `http://localhost:3000/embed/search?userId=COMPANY_B_ID`
2. Enter tracking number: `TKS-COMP-B-001`
3. Click "Track Shipment"

**Expected Result:**
- ✅ Shows shipment details
- ✅ Shows Company B's name

---

#### Test 2.4: Company B trying to track Company A's shipment ❌
```
Request: /api/track?trackingNumber=TKS-COMP-A-001&userId=COMPANY_B_ID
Expected: ❌ Returns "Shipment not found"
```

**Steps:**
1. Open: `http://localhost:3000/embed/search?userId=COMPANY_B_ID`
2. Enter tracking number: `TKS-COMP-A-001` (Company A's tracking number)
3. Click "Track Shipment"

**Expected Result:**
- ❌ Shows error: "Shipment not found"
- ✅ Company A's data remains private

---

## Test 3: Widget Preview Links ✅

### Objective
Verify that preview links work correctly.

### Steps
1. Log in to any company account
2. Go to Settings page
3. Find "Option 1: Inline Search Box"
4. Click "👁️ Preview Widget" button
5. New tab should open with the inline widget

### Expected Results
- ✅ Widget loads correctly
- ✅ Shows company name at the top
- ✅ Has search input field
- ✅ Has "Track Shipment" button
- ✅ Can enter tracking number and search

### Repeat for Option 2
1. Find "Option 2: Modal Popup Button"
2. Click "👁️ Preview Widget" button
3. New tab opens with modal widget

### Expected Results
- ✅ Shows "Track Your Shipment" button
- ✅ Clicking button opens modal popup
- ✅ Modal has company name
- ✅ Modal has search functionality
- ✅ Can close modal with X button

---

## Test 4: Copy Code Functionality ✅

### Objective
Verify that copy buttons work correctly.

### Steps
1. Go to Settings page
2. Click "📋 Copy ID" button under Company ID

### Expected Results
- ✅ Shows alert: "Company ID copied to clipboard!"
- ✅ Clipboard contains the Company ID

### Test Copy Code Buttons
1. Click "📋 Copy Code" for Inline widget
   - ✅ Alert shows: "Inline widget code copied to clipboard!"
   - ✅ Clipboard contains full HTML code with correct userId

2. Click "📋 Copy Code" for Modal widget
   - ✅ Alert shows: "Modal widget code copied to clipboard!"
   - ✅ Clipboard contains full HTML code with correct userId

---

## Test 5: API Endpoint Validation ✅

### Objective
Test API endpoints directly to verify security.

### Test 5.1: New API with both parameters ✅
```bash
curl "http://localhost:3000/api/track?trackingNumber=TKS-COMP-A-001&userId=COMPANY_A_ID"
```

**Expected Result:**
- ✅ Status: 200 OK
- ✅ Returns shipment JSON data

---

### Test 5.2: New API without userId ❌
```bash
curl "http://localhost:3000/api/track?trackingNumber=TKS-COMP-A-001"
```

**Expected Result:**
- ❌ Status: 400 Bad Request
- ❌ Error: "User ID is required"

---

### Test 5.3: New API without trackingNumber ❌
```bash
curl "http://localhost:3000/api/track?userId=COMPANY_A_ID"
```

**Expected Result:**
- ❌ Status: 400 Bad Request
- ❌ Error: "Tracking number is required"

---

### Test 5.4: New API with wrong userId ❌
```bash
curl "http://localhost:3000/api/track?trackingNumber=TKS-COMP-A-001&userId=WRONG_ID"
```

**Expected Result:**
- ❌ Status: 404 Not Found
- ❌ Error: "Shipment not found. Please check your tracking number and try again."

---

### Test 5.5: Old API with userId parameter (backward compatibility) ✅
```bash
curl "http://localhost:3000/api/track/TKS-COMP-A-001?userId=COMPANY_A_ID"
```

**Expected Result:**
- ✅ Status: 200 OK
- ✅ Returns shipment JSON data
- ✅ Backward compatible with old endpoint

---

### Test 5.6: Old API without userId (legacy support) ✅
```bash
curl "http://localhost:3000/api/track/TKS-COMP-A-001"
```

**Expected Result:**
- ✅ Status: 200 OK
- ✅ Returns shipment JSON data
- ✅ Works for direct tracking links (e.g., from emails)

---

## Test 6: Widget Integration Test 🌐

### Objective
Test the widget on an actual HTML page.

### Setup
Create a test HTML file: `test-widget.html`

```html
<!DOCTYPE html>
<html>
<head>
  <title>Widget Test</title>
</head>
<body>
  <h1>Test Tracking Widget</h1>
  
  <!-- Replace YOUR_COMPANY_ID with actual Company ID -->
  <script>
    window.TrakoShipConfig = {
      mode: 'inline',
      userId: 'YOUR_COMPANY_ID',
      containerId: 'trakoship-search'
    };
  </script>
  <script src="http://localhost:3000/widget.js"></script>
  <div id="trakoship-search"></div>
</body>
</html>
```

### Steps
1. Replace `YOUR_COMPANY_ID` with actual Company ID from Settings
2. Open `test-widget.html` in browser
3. Enter a tracking number that belongs to this company
4. Click "Track Shipment"

### Expected Results
- ✅ Widget loads and displays
- ✅ Can search for tracking number
- ✅ Shows shipment details for company's shipments
- ❌ Shows "not found" for other companies' shipments

---

## Test 7: Error Handling ⚠️

### Test 7.1: Invalid Tracking Number Format
**Steps:**
1. Open widget
2. Enter: `INVALID-123`
3. Click "Track Shipment"

**Expected:**
- ❌ Shows error message
- ❌ Does not crash

---

### Test 7.2: Empty Tracking Number
**Steps:**
1. Open widget
2. Leave tracking number empty
3. Click "Track Shipment"

**Expected:**
- ❌ Shows: "Please enter a tracking number"
- ❌ Does not make API call

---

### Test 7.3: Non-existent Tracking Number
**Steps:**
1. Open widget
2. Enter: `TKS-NOTEXIST-999`
3. Click "Track Shipment"

**Expected:**
- ❌ Shows: "Shipment not found. Please check your tracking number and try again."

---

## Test 8: Responsive Design 📱

### Objective
Verify widgets work on different screen sizes.

### Steps
1. Open widget preview
2. Resize browser window to mobile size (375px width)
3. Test search functionality
4. Resize to tablet size (768px width)
5. Test search functionality
6. Resize to desktop size (1920px width)
7. Test search functionality

### Expected Results
- ✅ Widget adapts to screen size
- ✅ All elements remain visible and usable
- ✅ Search functionality works at all sizes
- ✅ No horizontal scrolling needed

---

## Test 9: Multiple Companies Simultaneously 🏢

### Objective
Verify system handles multiple companies correctly.

### Setup
Open 3 browser tabs:
- Tab 1: Company A's widget
- Tab 2: Company B's widget
- Tab 3: Company C's widget

### Steps
1. In each tab, search for a tracking number from that company
2. Verify each shows correct results
3. In Tab 1, try searching for Company B's tracking number
4. In Tab 2, try searching for Company C's tracking number

### Expected Results
- ✅ Each widget shows only its company's shipments
- ❌ Cross-company searches return "not found"
- ✅ No interference between tabs
- ✅ Each widget maintains its own company context

---

## Test 10: Performance Test ⚡

### Objective
Verify API responds quickly.

### Steps
1. Make 10 consecutive API calls:
```bash
for i in {1..10}; do
  time curl "http://localhost:3000/api/track?trackingNumber=TKS-TEST-001&userId=YOUR_ID"
done
```

### Expected Results
- ✅ Each request completes in < 500ms
- ✅ No errors or timeouts
- ✅ Consistent response times

---

## ✅ Test Checklist

Use this checklist to track your testing progress:

- [ ] Test 1: Settings Page Simplification
- [ ] Test 2.1: Company A tracking own shipment
- [ ] Test 2.2: Company A trying to track Company B's shipment (CRITICAL)
- [ ] Test 2.3: Company B tracking own shipment
- [ ] Test 2.4: Company B trying to track Company A's shipment (CRITICAL)
- [ ] Test 3: Widget Preview Links (Inline)
- [ ] Test 3: Widget Preview Links (Modal)
- [ ] Test 4: Copy Code Functionality
- [ ] Test 5.1: API with both parameters
- [ ] Test 5.2: API without userId
- [ ] Test 5.3: API without trackingNumber
- [ ] Test 5.4: API with wrong userId
- [ ] Test 5.5: Old API with userId
- [ ] Test 5.6: Old API without userId
- [ ] Test 6: Widget Integration
- [ ] Test 7: Error Handling
- [ ] Test 8: Responsive Design
- [ ] Test 9: Multiple Companies
- [ ] Test 10: Performance

---

## 🚨 Critical Tests (Must Pass)

These tests are CRITICAL for security:

1. **Test 2.2 & 2.4:** Company isolation
   - If these fail, there's a security breach
   - Companies can see each other's data
   - MUST return "Shipment not found"

2. **Test 5.2:** API requires userId
   - If this fails, anyone can track any shipment
   - Security vulnerability

3. **Test 5.4:** API validates userId
   - If this fails, wrong userId shows data
   - Security vulnerability

---

## 📊 Success Criteria

The system passes if:
- ✅ All critical tests pass (Tests 2.2, 2.4, 5.2, 5.4)
- ✅ Settings page is clean and simple
- ✅ Widgets work correctly
- ✅ Copy buttons function properly
- ✅ No company can see another company's shipments
- ✅ Error messages are clear and helpful

---

## 🐛 If Tests Fail

### Settings page shows old sections
- **Problem:** Cache issue or file not updated
- **Solution:** Hard refresh browser (Ctrl+Shift+R)

### Company can see other company's shipments
- **Problem:** CRITICAL security issue
- **Solution:** Check API implementation in `src/app/api/track/route.ts`

### Widget doesn't load
- **Problem:** JavaScript error or wrong URL
- **Solution:** Check browser console for errors

### Copy button doesn't work
- **Problem:** Clipboard permissions
- **Solution:** Ensure site is HTTPS or localhost

---

## 📝 Test Report Template

After testing, document results:

```
Test Date: [DATE]
Tester: [NAME]
Environment: [Development/Staging/Production]

Results:
✅ Settings Page: PASS
✅ Company Isolation: PASS
✅ Widget Functionality: PASS
✅ API Security: PASS
✅ Error Handling: PASS
✅ Responsive Design: PASS

Critical Tests:
✅ Test 2.2: PASS - Company A cannot see Company B's shipments
✅ Test 2.4: PASS - Company B cannot see Company A's shipments
✅ Test 5.2: PASS - API requires userId
✅ Test 5.4: PASS - API validates userId

Issues Found: [NONE / LIST ISSUES]

Overall Status: ✅ PASS / ❌ FAIL
```

---

## 🎉 Conclusion

If all tests pass, the tracking system is:
- ✅ Secure (company isolation)
- ✅ Simple (clean UI)
- ✅ Functional (widgets work)
- ✅ User-friendly (easy to integrate)

Ready for production! 🚀

