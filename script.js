var myChart;
    $(document).ready(function () {
        getData();
    });
    function getData() {
        var labels = new Array();
        var datas = new Array();
        var lotsize = Number(document.getElementById('LotSize').value);

        var s1 = Number(document.getElementById('Strike1').value);
        var s2 = Number(document.getElementById('Strike2').value);
        var s3 = Number(document.getElementById('Strike3').value);
        var s4 = Number(document.getElementById('Strike4').value);

        var p1 = Number(document.getElementById('Price1').value);
        var p2 = Number(document.getElementById('Price2').value);
        var p3 = Number(document.getElementById('Price3').value);
        var p4 = Number(document.getElementById('Price4').value);

        var cnt = 0;
        var low = s1;
        var high = s1;
        var mid = s1;
        var lowest = s1;
        var highest = s1;
        if (mid > s2)
            mid = s2;
        if (low > s2)
            low = s2;
        if (low > s3)
            low = s3;
        if (low > s4)
            low = s4;
        if (high < s2)
            high = s2;
        if (high < s3)
            high = s3;
        if (high < s4)
            high = s4;
        if (low > 9) {
            highest = Math.ceil((high * 110 / 100) / 10) * 10;
            lowest = Math.ceil((low * 90 / 100) / 10) * 10;
        }
        else {
            highest = high;
            lowest = low;
        }
        var net = p1 + p2 - p3 - p4;
        var netpre = (p1 + p2 - p3 - p4) * lotsize;
        var Breakevenlow = s1 - net;
        var BreakevenHigh = s2 + net;

        var maxlost = -((Breakevenlow - low) * lotsize).toFixed(0);
        var maxpro = (netpre).toFixed(0);
        document.getElementById("MaxProfit").innerHTML = maxpro;
        document.getElementById("MaxLoss").innerHTML = maxlost;
        document.getElementById("Breakeven").innerHTML = Breakevenlow + " , " + BreakevenHigh;
        while (lowest < highest) {
            if (lowest >= mid) {
                var ttl = lowest - mid;
                var final = (BreakevenHigh - lowest) * lotsize;
            }
            else {
                var ttl = mid - lowest;
                var final = (lowest - Breakevenlow) * lotsize;
            }
            if (final < maxlost) { final = maxlost; }
            datas[cnt] = final;
            labels[cnt] = lowest;
            if (low > 999)
                lowest += 10;
            else
                lowest += 1;
            cnt++;
        }
        const data = {
            labels: labels,
            datasets: [
                {
                    label: 'Dataset 1',
                    data: datas,
                    borderColor: 'rgba(255, 99, 132, 0.2)',
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                }
            ]
        };
        const config = {
            type: 'line',
            data: data,
            options: {
                responsive: true,

                elements: {
                    point: {
                        radius: 0
                    }
                },
                ticks: {
                    autoSkip: true,
                    maxTicksLimit: 10
                },
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                        callbacks: {
                            title: function (tooltipItem, data) {
                                return tooltipItem[0].label;
                            },
                            label: function (tooltipItem, data) {
                                return tooltipItem.formattedValue;
                            },
                        }
                    },
                    title: {
                        display: true,
                        text: 'Iron Butterfly'
                    }
                },
                scales: {
                    y: {
                        min: maxlost,
                        max: Math.ceil(maxpro / 100) * 100,
                        grid: {
                            drawBorder: false,
                            color: function (context) {
                                if (context.tick.value > 0) {
                                    return;
                                } else if (context.tick.value < 0) {
                                    return;
                                }

                                return '#000000';
                            },
                        },
                    },
                }
            },
        };
        if (myChart !== undefined)
            myChart.destroy();
        var ctx = document.getElementById('myChart').getContext('2d');
        myChart = new Chart(ctx, config);
    }