const amountInput = document.getElementById("amount");
const fromCurrency = document.getElementById("fromCurrency");
const toCurrency = document.getElementById("toCurrency");

const convertBtn = document.getElementById("convertBtn");
const swapBtn = document.getElementById("swapBtn");

const convertedAmount = document.getElementById("convertedAmount");
const rateText = document.getElementById("rateText");

const loading = document.getElementById("loading");
const errorMessage = document.getElementById("errorMessage");


// Currency symbols
const currencySymbols = {
    USD: "$",
    INR: "₹",
    EUR: "€",
    GBP: "£",
    JPY: "¥",
    AUD: "A$",
    CAD: "C$",
    SGD: "S$"
};


// Convert currency
async function convertCurrency() {

    const amount = parseFloat(amountInput.value);
    const from = fromCurrency.value;
    const to = toCurrency.value;

    errorMessage.textContent = "";

    if (isNaN(amount) || amount <= 0) {
        errorMessage.textContent = "Please enter a valid amount.";
        return;
    }

    if (from === to) {

        convertedAmount.textContent =
            `${currencySymbols[to]} ${amount.toFixed(2)}`;

        rateText.textContent =
            `1 ${from} = 1 ${to}`;

        return;
    }

    loading.style.display = "block";
    convertBtn.disabled = true;

    try {

        const response = await fetch(
            `https://api.frankfurter.app/latest?amount=${amount}&from=${from}&to=${to}`
        );

        if (!response.ok) {
            throw new Error("Unable to fetch exchange rate");
        }

        const data = await response.json();

        const result = data.rates[to];

        const oneUnitResponse = await fetch(
            `https://api.frankfurter.app/latest?amount=1&from=${from}&to=${to}`
        );

        const oneUnitData = await oneUnitResponse.json();

        const rate = oneUnitData.rates[to];

        convertedAmount.textContent =
            `${currencySymbols[to]} ${result.toFixed(2)}`;

        rateText.textContent =
            `1 ${from} = ${rate.toFixed(4)} ${to}`;

    } catch (error) {

        errorMessage.textContent =
            "Unable to fetch exchange rate. Please try again.";

        console.error(error);

    } finally {

        loading.style.display = "none";
        convertBtn.disabled = false;
    }
}


// Swap currencies
swapBtn.addEventListener("click", () => {

    const oldFrom = fromCurrency.value;

    fromCurrency.value = toCurrency.value;
    toCurrency.value = oldFrom;

    convertCurrency();
});


// Convert button
convertBtn.addEventListener("click", convertCurrency);


// Convert when amount changes
amountInput.addEventListener("keypress", (event) => {

    if (event.key === "Enter") {
        convertCurrency();
    }

});


// Initial conversion
convertCurrency();