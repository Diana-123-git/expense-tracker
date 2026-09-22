
let data = null;

// Fetch the JSON data
async function fetchData() {
  try {
    const response = await fetch("./expenses.json");

    if (!response.ok) {
      throw new Error(`Failed to load expenses.json: ${response.status}`);
    }

    data = await response.json();

    // Only run the report after data has loaded
    initializeReport();

  } catch (error) {
    console.error("Error loading expense data:", error);
  }
}


// Initialize the entire report
function initializeReport() {
  const parseMoney = (value) => {
    return Number(
      String(value).replace(/[^\d.-]/g, "")
    ) || 0;
  };

  const money = (value) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      maximumFractionDigits: 0
    }).format(value);
  };


  // Convert expense amounts from strings to numbers
  const expenses = data.expenses.map((expense) => ({
    ...expense,
    value: parseMoney(expense.amount)
  }));


  // Calculate summary values
  const total = expenses.reduce(
    (sum, expense) => sum + expense.value,
    0
  );

  const budget = parseMoney(data.summary.monthly_budget);

  const remaining = budget - total;

  const avg = expenses.length
    ? total / expenses.length
    : 0;


  // Update summary cards
  document.getElementById("userName").textContent =
    data.user.name;

  document.getElementById("totalExpenses").textContent =
    money(total);

  document.getElementById("expenseCount").textContent =
    `${expenses.length} transactions`;

  document.getElementById("budget").textContent =
    money(budget);

  document.getElementById("budgetUsage").textContent =
    budget > 0
      ? `${((total / budget) * 100).toFixed(1)}% used`
      : "0% used";

  document.getElementById("remaining").textContent =
    money(remaining);

  document.getElementById("average").textContent =
    money(avg);


  // =========================
  // CATEGORY TOTALS
  // =========================

  const categoryTotals = {};

  // =========================
  // PAYMENT TOTALS
  // =========================

  const paymentTotals = {};

  // =========================
  // DAILY TOTALS
  // =========================

  const dailyTotals = {};


  expenses.forEach((expense) => {

    categoryTotals[expense.category] =
      (categoryTotals[expense.category] || 0) +
      expense.value;

    paymentTotals[expense.payment_method] =
      (paymentTotals[expense.payment_method] || 0) +
      expense.value;

    dailyTotals[expense.date] =
      (dailyTotals[expense.date] || 0) +
      expense.value;

  });


  // =========================
  // CHART DEFAULTS
  // =========================
  //LESSON FOR TAIWO. These charts use the recharts library and I initiate donut 
  // charts using the information I fetch from the json
  const chartDefaults = {
    responsive: true,
    maintainAspectRatio: false,

    plugins: {
      legend: {
        labels: {
          usePointStyle: true,
          boxWidth: 8,
          padding: 18,
          font: {
            size: 11
          }
        }
      }
    }
  };


  // =========================
  // CATEGORY CHART
  // =========================

  new Chart(
    document.getElementById("categoryChart"),
    {
      type: "doughnut",

      data: {
        labels: Object.keys(categoryTotals),

        datasets: [
          {
            data: Object.values(categoryTotals),
            borderWidth: 0,
            hoverOffset: 5
          }
        ]
      },

      options: {
        ...chartDefaults,

        cutout: "68%",

        plugins: {

          ...chartDefaults.plugins,

          legend: {
            position: "right",

            labels: {
              usePointStyle: true,
              boxWidth: 8,
              padding: 14,

              font: {
                size: 11
              }
            }
          },

          tooltip: {
            callbacks: {
              label: (context) => {
                return ` ${money(context.raw)}`;
              }
            }
          }

        }
      }
    }
  );


  // =========================
  // PAYMENT METHOD CHART
  // =========================

  new Chart(
    document.getElementById("paymentChart"),
    {
      type: "bar",

      data: {
        labels: Object.keys(paymentTotals),

        datasets: [
          {
            label: "Amount",
            data: Object.values(paymentTotals),
            borderRadius: 7
          }
        ]
      },

      options: {

        ...chartDefaults,

        indexAxis: "y",

        plugins: {

          legend: {
            display: false
          },

          tooltip: {
            callbacks: {
              label: (context) => {
                return money(context.raw);
              }
            }
          }

        },

        scales: {

          x: {
            beginAtZero: true,

            ticks: {
              callback: (value) => {
                return "₦" + Number(value).toLocaleString();
              }
            }
          },

          y: {
            grid: {
              display: false
            }
          }

        }
      }
    }
  );


  // =========================
  // DAILY SPENDING CHART
  // =========================

  const days = Object.keys(dailyTotals).sort();


  new Chart(
    document.getElementById("dailyChart"),
    {
      type: "line",

      data: {

        labels: days.map((date) => {
          return date.slice(8);
        }),

        datasets: [
          {
            label: "Daily spend",

            data: days.map((date) => {
              return dailyTotals[date];
            }),

            tension: 0.35,

            fill: true,

            pointRadius: 4
          }
        ]
      },

      options: {

        ...chartDefaults,

        plugins: {

          legend: {
            display: false
          },

          tooltip: {
            callbacks: {
              label: (context) => {
                return money(context.raw);
              }
            }
          }

        },

        scales: {

          x: {
            title: {
              display: true,
              text: "September day"
            }
          },

          y: {

            beginAtZero: true,

            ticks: {
              callback: (value) => {
                return "₦" + Number(value).toLocaleString();
              }
            }

          }

        }
      }
    }
  );


  // =========================
  // EXPENSE TABLE
  // =========================

  function renderTable(filter = "all") {

    const tbody =
      document.getElementById("expenseTable");


    const rows = expenses
      .filter((expense) => {

        return (
          filter === "all" ||
          expense.status === filter
        );

      })

      .sort((a, b) => {
        return b.date.localeCompare(a.date);
      });


    tbody.innerHTML = rows
      .map((expense) => {

        return `
          <tr>

            <td>
              ${expense.date}
            </td>

            <td>
              <strong>
                ${expense.description}
              </strong>
            </td>

            <td>
              ${expense.category}
            </td>

            <td>
              ${expense.payment_method}
            </td>

            <td>
              <span class="status ${expense.status}">
                ${expense.status}
              </span>
            </td>

            <td class="amount">
              ${money(expense.value)}
            </td>

          </tr>
        `;

      })
      .join("");
  }


  // Initial table
  renderTable();


  // =========================
  // STATUS FILTER
  // =========================

  const statusFilter =
    document.getElementById("statusFilter");


  statusFilter.addEventListener(
    "change",
    (event) => {

      renderTable(
        event.target.value
      );

    }
  );


  // =========================
  // CSV EXPORT
  // =========================

  document
    .getElementById("downloadBtn")
    .addEventListener("click", () => {

      const csv = [

        [
          "Date",
          "Description",
          "Category",
          "Payment Method",
          "Status",
          "Amount"
        ],

        ...expenses.map((expense) => [

          expense.date,

          expense.description,

          expense.category,

          expense.payment_method,

          expense.status,

          expense.value

        ])

      ]

        .map((row) => {

          return row
            .map((value) => {

              return `"${String(value)
                .replaceAll('"', '""')}"`;

            })
            .join(",");

        })

        .join("\n");


      const blob = new Blob(
        [csv],
        {
          type: "text/csv"
        }
      );


      const url =
        URL.createObjectURL(blob);


      const link =
        document.createElement("a");


      link.href = url;

      link.download =
        "september-expense-report.csv";


      link.click();


      URL.revokeObjectURL(url);

    });

}


// Start the application
fetchData();
