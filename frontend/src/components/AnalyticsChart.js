import React from "react";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer
} from "recharts";


function AnalyticsChart({ history = [] }) {

  // =========================
  // COUNT ISSUES
  // =========================

  const issueCount = {};

  history.forEach((item) => {

    const issue =
      item.issue || "Unknown";

    issueCount[issue] =
      (issueCount[issue] || 0) + 1;

  });


  const chartData =
    Object.keys(issueCount).map((key) => ({
      name: key,
      value: issueCount[key]
    }));


  const COLORS = [
    "#06b6d4",
    "#ef4444",
    "#10b981",
    "#f59e0b",
    "#8b5cf6"
  ];


  return (

    <div
      style={{
        width: "100%",
        marginTop: "25px"
      }}
    >

      {/* =========================
          NO DATA
      ========================= */}

      {chartData.length === 0 ? (

        <div
          style={{
            background: "#0f172a",
            borderRadius: "18px",
            padding: "50px",
            textAlign: "center",
            color: "#94a3b8",
            border: "1px solid #334155"
          }}
        >

          <h2
            style={{
              color: "#38bdf8"
            }}
          >
            📊 Analytics Dashboard
          </h2>

          <p>
            No detection reports available yet.
          </p>

          <p>
            Upload an image and perform detection
            to generate analytics.
          </p>

        </div>

      ) : (

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(350px, 1fr))",
            gap: "25px",
            width: "100%"
          }}
        >

          {/* =========================
              PIE CHART
          ========================= */}

          <div
            style={{
              background:
                "linear-gradient(145deg,#0f172a,#1e293b)",
              borderRadius: "18px",
              padding: "20px",
              border: "1px solid #334155",
              minWidth: 0
            }}
          >

            <h2
              style={{
                color: "#38bdf8",
                textAlign: "center",
                marginBottom: "15px"
              }}
            >
              🥧 Issue Distribution
            </h2>


            <ResponsiveContainer
              width="100%"
              height={350}
            >

              <PieChart>

                <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="45%"
                  outerRadius={110}
                  innerRadius={50}
                  paddingAngle={4}
                >

                  {chartData.map(
                    (entry, index) => (

                      <Cell
                        key={`cell-${index}`}
                        fill={
                          COLORS[
                            index %
                            COLORS.length
                          ]
                        }
                      />

                    )
                  )}

                </Pie>


                <Tooltip />


                <Legend />

              </PieChart>

            </ResponsiveContainer>

          </div>


          {/* =========================
              BAR CHART
          ========================= */}

          <div
            style={{
              background:
                "linear-gradient(145deg,#0f172a,#1e293b)",
              borderRadius: "18px",
              padding: "20px",
              border: "1px solid #334155",
              minWidth: 0
            }}
          >

            <h2
              style={{
                color: "#38bdf8",
                textAlign: "center",
                marginBottom: "15px"
              }}
            >
              📊 Issue Statistics
            </h2>


            <ResponsiveContainer
              width="100%"
              height={350}
            >

              <BarChart
                data={chartData}
                margin={{
                  top: 10,
                  right: 20,
                  left: 0,
                  bottom: 10
                }}
              >

                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#475569"
                />


                <XAxis
                  dataKey="name"
                  stroke="#cbd5e1"
                />


                <YAxis
                  allowDecimals={false}
                  stroke="#cbd5e1"
                />


                <Tooltip />


                <Bar
                  dataKey="value"
                  fill="#06b6d4"
                  radius={[
                    8,
                    8,
                    0,
                    0
                  ]}
                />

              </BarChart>

            </ResponsiveContainer>

          </div>

        </div>

      )}

    </div>

  );

}


export default AnalyticsChart;