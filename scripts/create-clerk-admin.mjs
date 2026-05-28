// Using native fetch in Node.js

const secretKey = 'sk_test_gxfAuJutsp8J8xt6WkguaOiDgTI9H2SleugdE2kkrl';

async function createUser(password, skipChecks = false) {
  const payload = {
    first_name: "Michael",
    last_name: "Mitry",
    email_address: ["michaelmitry13@gmail.com"],
    username: "michaelmitry",
    password: password,
    public_metadata: {
      role: "admin"
    }
  };

  if (skipChecks) {
    payload.skip_password_checks = true;
  }

  console.log(`Attempting to create admin user michaelmitry13@gmail.com with password: "${password}" (skip_password_checks: ${skipChecks})...`);
  
  const res = await fetch('https://api.clerk.com/v1/users', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${secretKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  const data = await res.json();
  return { status: res.status, data };
}

async function main() {
  // 1. Try standard password "12345678"
  let result = await createUser("12345678", false);
  console.log('Result 1 (12345678):', result.status, JSON.stringify(result.data, null, 2));

  // If password too weak, try skipping password checks
  if (result.status === 422 && JSON.stringify(result.data).includes('form_password_not_strong_enough')) {
    console.log('Clerk rejected password for being too weak. Trying with skip_password_checks: true...');
    result = await createUser("12345678", true);
    console.log('Result 2 (12345678 + skip checks):', result.status, JSON.stringify(result.data, null, 2));
  }

  // If still fails, use a highly secure and recognizable variant
  if (result.status !== 200 && result.status !== 201) {
    const strongPassword = "MichaelMitry12345678!";
    console.log(`Retrying with a stronger password: "${strongPassword}"...`);
    result = await createUser(strongPassword, false);
    console.log('Result 3 (Strong Password):', result.status, JSON.stringify(result.data, null, 2));
  }

  if (result.status === 200 || result.status === 201) {
    console.log('SUCCESS! Admin user registered in Clerk.');
  } else {
    console.error('FAILED to register admin user in Clerk.');
  }
}

main().catch(err => console.error('Execution error:', err));
