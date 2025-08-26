// Simple test for registration API
const testRegistration = async () => {
  try {
    const response = await fetch("http://localhost:3000/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: "testuser@example.com",
        password: "password123",
        firstName: "Test",
        lastName: "User",
        phone: "1234567890",
        role: "student"
      }),
    });

    const data = await response.json();
    console.log("Registration test result:", data);
    
    if (response.ok) {
      console.log("✅ Registration successful!");
    } else {
      console.log("❌ Registration failed:", data.error);
    }
    
  } catch (error) {
    console.error("❌ Test error:", error);
  }
};

testRegistration();
