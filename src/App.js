import './App.css';
import React, { Suspense } from 'react';
import { Tabs, Spin } from 'antd';
import InvestmentCalculator from './InvestmentCalculator';
import { useTrackingCode } from "react-hubspot-tracking-code-hook";

const { TabPane } = Tabs;
const YoutubeLiveV3 = React.lazy(() => import('./YoutubeLiveV3'));

const App = () => {
  const { setPathPageView, setIdentity, setTrackPageView } = useTrackingCode();

  setPathPageView("/yt-react-demo");

  setIdentity("Nopparat.M@yuanta.co.th");

  setTrackPageView();

  return (
    <div className="">
      <Tabs defaultActiveKey="1" style={{ maxWidth: '800px', margin: '0 auto' }}>
          <TabPane tab="Investment Calculator" key="1">
            <InvestmentCalculator />
          </TabPane>
          <TabPane tab="Youtube Live" key="2">
            <Suspense fallback={<Spin size="large" />}>
              <YoutubeLiveV3 />
            </Suspense>
          </TabPane>
        </Tabs>
    </div>
  );
};

export default App;
