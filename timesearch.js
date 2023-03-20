document.addEventListener("DOMContentLoaded", function () {
  const dateTimeInputElement = document.getElementById("date-time-input");
  const dateTimeSubmitButton = document.getElementById("date-time-submit");
  const dateTimeResultElement = document.getElementById("date-time-result");

  async function getCurrentEpoch() {
    const apiUrl = "https://api.node.glif.io/rpc/v0";
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        jsonrpc: "2.0",
        method: "Filecoin.ChainHead",
        params: [],
        id: 1
      })
    });

    if (response.ok) {
      const data = await response.json();
      return data.result.Height;
    } else {
      throw new Error("Error fetching epoch data from Glif API");
    }
  }

  function dateToEpoch(date) {
    const filecoinGenesisTimestamp = 1598306400;
    const epochDuration = 30;
    const dateTimestamp = date.getTime() / 1000;
    const elapsedSeconds = dateTimestamp - filecoinGenesisTimestamp;
    const epoch = Math.floor(elapsedSeconds / epochDuration);
    return epoch;
  }

  dateTimeSubmitButton.addEventListener("click", async () => {
    const dateTime = new Date(dateTimeInputElement.value);
    if (!isNaN(dateTime.getTime())) {
      const localDateTime = new Date(dateTime.getTime());
      try {
        const epoch = dateToEpoch(localDateTime);
        dateTimeResultElement.textContent = "Date and Time " + localDateTime.toLocaleString(undefined, { hour12: false, timeZoneName: 'short', second: '2-digit', minute: '2-digit', hour: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric' }) + " corresponds to Epoch: " + epoch;
      } catch (error) {
        dateTimeResultElement.textContent = "Error fetching epoch data: " + error;
      }
    }
  });
});
