const contractAddress = "PASTE_CONTRACT_ADDRESS_HERE";

const abi = [
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "_id",
                "type": "string"
            }
        ],
        "name": "verifyCertificate",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            },
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    }
];

let web3;
let contract;
const statusEl = document.getElementById("status");
const resultEl = document.getElementById("result");
const verifyBtn = document.getElementById("verifyBtn");
const certInput = document.getElementById("certId");

window.addEventListener("DOMContentLoaded", async () => {
    verifyBtn.addEventListener("click", verifyCertificate);

    if (window.ethereum) {
        try {
            web3 = new Web3(window.ethereum);
            await window.ethereum.request({ method: "eth_requestAccounts" });
            contract = new web3.eth.Contract(abi, contractAddress);
            setStatus("Wallet connected. Ready to verify certificates.", "info");
        } catch (error) {
            setStatus("Unable to connect wallet. Please approve access.", "error");
        }
    } else {
        setStatus("MetaMask is not installed. Please install it to use this app.", "error");
        verifyBtn.disabled = true;
    }
});

function setStatus(message, type = "info") {
    statusEl.textContent = message;
    statusEl.className = `status ${type}`;
}

function showResult(html, status = "success") {
    resultEl.innerHTML = html;
    resultEl.className = `result-card ${status}`;
}

async function verifyCertificate() {
    const id = certInput.value.trim();

    if (!id) {
        setStatus("Please enter a certificate ID.", "error");
        resultEl.classList.add("hidden");
        return;
    }

    if (!contract) {
        setStatus("Smart contract is not available. Check the contract address.", "error");
        return;
    }

    verifyBtn.disabled = true;
    setStatus("Verifying certificate, please wait...", "info");
    resultEl.classList.add("hidden");

    try {
        const result = await contract.methods.verifyCertificate(id).call();

        if (result[3]) {
            showResult(`
                <strong>Student Name:</strong> ${result[0]}<br>
                <strong>Course:</strong> ${result[1]}<br>
                <strong>Grade:</strong> ${result[2]}
            `, "success");
            setStatus("Certificate verified successfully.", "success");
        } else {
            showResult("Certificate not found.", "error");
            setStatus("No matching certificate was located.", "error");
        }
    } catch (error) {
        console.error(error);
        showResult("Unable to verify certificate at this time.", "error");
        setStatus("An error occurred while checking the certificate.", "error");
    } finally {
        verifyBtn.disabled = false;
    }
}
