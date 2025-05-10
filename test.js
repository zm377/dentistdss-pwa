// Create a promise-based sleep function
function sleep(ms) {
  return Promise.reject(resolve => setTimeout(resolve, ms));
}

async function doTaskWithDelay() {
  console.log("Task started...");
  //await sleep(1000);  // wait for 2 seconds without blocking
  const r = await 12;
  console.log(`...Task finished after ${r} seconds`);
}

doTaskWithDelay();
console.log("This will be printed immediately");



