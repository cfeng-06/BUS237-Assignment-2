let inventory = JSON.parse(localStorage.getItem("inventory")) || [];
let chart;
let currentChartType = "pie";

function saveItems() {
    localStorage.setItem("inventory", JSON.stringify(inventory));
}

function addItem() {
    const name = document.getElementById("itemName").value.trim();
    const quantity = parseInt(document.getElementById("itemQuantity").value);
    const price = parseFloat(document.getElementById("itemPrice").value);

    if (!name || isNaN(quantity) || isNaN(price) || quantity <= 0 || price < 0) {
        alert("Please enter valid values. No negatives or invalid numbers allowed.");
        return;
    }

    const existingItem = inventory.find(item => item.name.toLowerCase() === name.toLowerCase());

    if (existingItem) {
        existingItem.quantity = quantity;
        existingItem.price = price;
    } else {
        inventory.push({ name, quantity, price });
    }

    saveItems();
    renderItems();
    clearInputs();
}

function renderItems() {
    const table = document.getElementById("inventoryTable");
    table.innerHTML = "";

    let totalQty = 0;
    let totalVal = 0;

    inventory.forEach((item, index) => {
        const lineTotal = item.quantity * item.price;
        totalQty += item.quantity;
        totalVal += lineTotal;

        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${item.name}</td>
            <td>${item.quantity}</td>
            <td>$${item.price.toFixed(2)}</td>
            <td>$${lineTotal.toFixed(2)}</td>
            <td><button onclick="deleteItem(${index})" class="danger">Delete</button></td>
        `;
        table.appendChild(row);
    });

    document.getElementById("totalItems").textContent = inventory.length;
    document.getElementById("totalQuantity").textContent = totalQty;
    document.getElementById("totalValue").textContent = totalVal.toFixed(2);

    updateChart();
}

function deleteItem(index) {
    const table = document.getElementById("inventoryTable");
    const row = table.children[index];

    row.classList.add("fade-out");

    setTimeout(() => {
        inventory.splice(index, 1);
        saveItems();
        renderItems();
    }, 300);
}

function clearInventory() {
    if (confirm("Are you sure you want to clear all inventory?")) {
        inventory = [];
        saveItems();
        renderItems();
    }
}

function clearInputs() {
    document.getElementById("itemName").value = "";
    document.getElementById("itemQuantity").value = "";
    document.getElementById("itemPrice").value = "";
}

function setChartType(type) {
    currentChartType = type;
    updateChart();
}

function updateChart() {
    const ctx = document.getElementById("inventoryChart");

    if (chart) chart.destroy();

    chart = new Chart(ctx, {
        type: currentChartType,
        data: {
            labels: inventory.map(item => item.name),
            datasets: [{
                label: "Quantity",
                data: inventory.map(item => item.quantity)
            }]
        },
        options: {
            responsive: true,
            animation: {
                duration: 1000,
                easing: 'easeOutQuart'
            },
            plugins: {
                legend: { display: true }
            }
        }
    });
}

document.addEventListener("DOMContentLoaded", renderItems);