const API_URL = "https://api.node.glif.io/rpc/v0";
const currentEpochElement = document.getElementById("current-epoch");
const localTimeElement = document.getElementById("local-time");
const clockElement = document.getElementById("clock");

let currentEpoch = null;

async function getCurrentEpoch() {
    const response = await fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            jsonrpc: "2.0",
            method: "Filecoin.ChainHead",
            id: 1
        })
    });

    if (!response.ok) {
        throw new Error("Failed to fetch current epoch");
    }

    const data = await response.json();
    return data.result.Height;
}

async function updateEpoch() {
    try {
        const epoch = await getCurrentEpoch();

        if (currentEpoch === null || epoch > currentEpoch) {
            currentEpoch = epoch;
            currentEpochElement.textContent = `Current Epoch: ${currentEpoch}`;
            setTimeout(updateEpoch, 28800); // Update the epoch every 28.8 seconds
        }
    } catch (error) {
        console.error("Error fetching epoch data:", error);
    }
}

function updateLocalTime() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    localTimeElement.textContent = `Local Time: ${hours}:${minutes}:${seconds}`;
    clockElement.textContent = `Clock: ${hours}:${minutes}:${seconds}`;
}

updateEpoch();
updateLocalTime();
setInterval(updateLocalTime, 1000); // Update local time and clock every 1 second

const epochInput = document.getElementById("epoch-input");
const epochSubmit = document.getElementById("epoch-submit");
const epochResult = document.getElementById("epoch-result");

epochSubmit.addEventListener("click", () => {
    const inputEpoch = parseInt(epochInput.value, 10);

    if (isNaN(inputEpoch) || inputEpoch < 0) {
        epochResult.textContent = "Please enter a valid epoch number.";
        return;
    }

    const epochDuration = 28.8; // 28.8 seconds per epoch
    const filecoinGenesisTimestamp = 1602799200; // UNIX timestamp of the Filecoin genesis block (2020-10-15 22:00:00 UTC)

    const epochTimestamp = filecoinGenesisTimestamp + inputEpoch * epochDuration;
    const epochDate = new Date(epochTimestamp * 1000); // JavaScript uses milliseconds, so multiply by 1000

    epochResult.textContent = `Epoch ${inputEpoch} corresponds to: ${epochDate.toLocaleString()}`;
});
