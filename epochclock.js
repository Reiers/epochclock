const API_URL = "https://api.node.glif.io/rpc/v0";

document.addEventListener("DOMContentLoaded", function () {
  const currentEpochElement = document.getElementById("current-epoch");
  const localTimeElement = document.getElementById("local-time");
  const epochInputElement = document.getElementById("epoch-input");
  const epochSubmitButton = document.getElementById("epoch-submit");
  const epochResultElement = document.getElementById("epoch-result");

  async function getCurrentEpoch() {
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jsonrpc: "2.0",
          id: 1,
          method: "Filecoin.ChainHead",
          params: [],
        }),
      });

      const data = await response.json();
      return data.result.Height;
    } catch (error) {
      console.error("Error fetching epoch data:", error);
      return null;
    }
  }

  function epochToDate(epoch) {
    const filecoinGenesisTimestamp = 1598313600; // UNIX timestamp of the Filecoin genesis block (2020-08-25 00:00:00 UTC)
    const epochDuration = 30 * 1000; // 30 seconds per epoch
    const epochTimestamp = new Date((filecoinGenesisTimestamp * 1000) + epoch * epochDuration);
    return epochTimestamp;
  }

  async function updateEpoch() {
    const currentEpoch = await getCurrentEpoch();
    if (currentEpoch !== null) {
      currentEpochElement.textContent = "Current Epoch: " + currentEpoch;
    }
    setTimeout(updateEpoch, 90000); // Update Epoch every 1 minute and 30 seconds
  }

  function updateLocalTime() {
    const currentDate = new Date();
    localTimeElement.textContent = "Local Time: " + currentDate.toLocaleString(undefined, { timeZoneName: 'short' });
    setTimeout(updateLocalTime, 1000); // Update Local Time every second
  }

  epochSubmitButton.addEventListener("click", () => {
    const epoch = parseInt(epochInputElement.value, 10);
    if (!isNaN(epoch)) {
      const epochDate = epochToDate(epoch);
      epochResultElement.textContent = "Epoch " + epoch + " Date and Time: " + epochDate.toLocaleString(undefined, { timeZoneName: 'short' });
    }
  });

  updateEpoch();
  updateLocalTime();
});
