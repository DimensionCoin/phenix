import React, { useEffect, memo } from "react";

function CoinCharts({
  symbol,
  topChartRef,
  fearGreedChartRef,
}: {
  symbol: string;
  topChartRef: React.RefObject<HTMLDivElement>;
  fearGreedChartRef: React.RefObject<HTMLDivElement>;
}) {
  useEffect(() => {
    // Clear any previous content in the container to avoid duplicates
    if (topChartRef.current) {
      topChartRef.current.innerHTML = "";
    }
    if (fearGreedChartRef.current) {
      fearGreedChartRef.current.innerHTML = "";
    }

    const script = document.createElement("script");
    script.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = `
      {
        "autosize": true,
        "symbol": "${symbol}",
        "interval": "D",
        "timezone": "America/Toronto",
        "theme": "dark",
        "style": "1",
        "locale": "en",
        "backgroundColor": "rgba(0, 0, 0, 1)",
        "gridColor": "rgba(152, 0, 255, 0.19)",
        "hide_side_toolbar": false,
        "allow_symbol_change": false,
        "calendar": false,
        "hide_volume": true,
        "support_host": "https://www.tradingview.com"
      }`;

    const fearGreedScript = document.createElement("script");
    fearGreedScript.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-technical-analysis.js";
    fearGreedScript.type = "text/javascript";
    fearGreedScript.async = true;
    fearGreedScript.innerHTML = `
      {
        "interval": "15m",
        "width": "100%",
        "isTransparent": true,
        "height": "100%",
        "symbol": "${symbol}",
        "showIntervalTabs": true,
        "displayMode": "single",
        "locale": "en",
        "colorTheme": "dark"
      }`;

    if (topChartRef.current) {
      topChartRef.current.appendChild(script);
    }
    if (fearGreedChartRef.current) {
      fearGreedChartRef.current.appendChild(fearGreedScript);
    }
  }, [symbol, topChartRef, fearGreedChartRef]);

  return null; // No need to return anything, as the charts are directly injected into the parent containers
}

export default memo(CoinCharts);
