import { BarChart } from '@mui/x-charts/BarChart';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { SERVER_ADDRESS } from '@/global/global-variables';
import Cookies from 'js-cookie';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { applyFilterStateChangeAtom, lineChartDataAtom, lineChartDataLoadingAtom } from '@/store/chart-store';

const darkTheme = createTheme({ palette: { mode: 'dark' } }); // Create dark theme
const barDefaultColors = "#5090DC";
const barSelectedColors = "coral";

const chartSetting = {
  xAxis: [
    {
      label: 'Total Time Spent',
    },
  ],

  width: 500,
  height: 400,
};

type Props = {

  dataset: {
    key: string;
    value: number;
  }[],

  setDataset: React.Dispatch<React.SetStateAction<{
    key: string;
    value: number;
  }[]>>

  // If true then will automatically fetch data based on the cookies 
  initalLoading: boolean
}


const  HorizontalBarChart = React.memo(({ dataset, setDataset, initalLoading }: Props) => {

  const [isLoading, setIsLoading] = useState(false);
  const [barColors, setBarColors] = useState([barDefaultColors]);
  const setLineChartData = useSetRecoilState(lineChartDataAtom);
  const setLineChartLoading = useSetRecoilState(lineChartDataLoadingAtom);
  const applyFilterState = useRecoilValue(applyFilterStateChangeAtom);
  const navigate = useNavigate();
  const dataLength = dataset.length;

  async function getBarChartData() {

    try {

      setIsLoading(true);

      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      const age = Cookies.get("age") || "all";
      const gender = Cookies.get("gender") || "all";


      const dateFrom = Cookies.get("date-from") || "0";
      const dateTo = Cookies.get("date-to") || Date.now().toString();

      let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: `${SERVER_ADDRESS}chart/barchart?age=${age}&gender=${gender}&dateFrom=${dateFrom}&dateTo=${dateTo}`,
        headers: {
          'Authorization': `Bearer ${token}`
        }
      };

      const res = await axios.request(config);

      await new Promise((r) => {
        setTimeout(r, 4000);
      });
      setDataset(res.data.data)


    } catch (error) {

      console.log("Unable to fetch initial barchart data", error);

    } finally {

      setIsLoading(false);
    }
  }

  // Change state apply filter button when clicked
  useEffect(() => {
    setBarColors([barDefaultColors]);
  }, [applyFilterState]);

  // Get initial barChartData based on the cookies
  useEffect(() => {
    
    if(initalLoading)
      getBarChartData();

  }, []);

  // Used to show line chart for the selected feature
  async function handleBarClick(feature: string) {

    try {

      setLineChartLoading(true);
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      const age = Cookies.get("age") || "all";
      const gender = Cookies.get("gender") || "all";


      const dateFrom = Cookies.get("date-from") || "0";
      const dateTo = Cookies.get("date-to") || Date.now().toString();

      let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: `${SERVER_ADDRESS}chart/linechart?age=${age}&gender=${gender}&dateFrom=${dateFrom}&dateTo=${dateTo}&feature=${feature}`,
        headers: {
          'Authorization': `Bearer ${token}`
        }
      };

      const res = await axios.request(config);

      await new Promise((r) => {
        setTimeout(r, 2000);
      });

      setLineChartData(res.data.data);

    } catch (error) {

      console.log("Unable to fetch linechart data", error);
    } finally {
      setLineChartLoading(false);
    }
  }

  return (
    <ThemeProvider theme={darkTheme}>
      <div className='flex'>
        <BarChart className="bg-[#192231] w-full"
          onAxisClick={(_, data) => {

            if (data) {

              const newBarColors = Array(dataLength).fill(barDefaultColors);
              newBarColors[data.dataIndex] = barSelectedColors;
              setBarColors(newBarColors);

              if (data.axisValue) {
                const value = data.axisValue;

                if (value === "A" || value === "B" || value === "C" || value === "D" || value === "E" || value === "F")
                  handleBarClick(data.axisValue as string)
              }
            }
          }}
          loading={isLoading}
          barLabel={(v) => `${v.value}`}
          dataset={dataset}

          yAxis={[{
            scaleType: 'band', dataKey: 'key',
            label: "Features",
            colorMap: {
              type: "ordinal",
              colors: barColors,
            }
          }]}

          series={[{ dataKey: 'value', label: "Time spent", valueFormatter, color: barDefaultColors }]}
          layout="horizontal"
          {...chartSetting}
        />
      </div>
    </ThemeProvider>

  );
})

function valueFormatter(value: number | null) {
  return `${value}`;
}

export default HorizontalBarChart;