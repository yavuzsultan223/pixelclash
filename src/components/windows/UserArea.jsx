import React, { Suspense, useCallback, useContext } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { t } from 'ttag';

import {
  fetchStats,
} from '../../store/actions/thunks';
import WindowContext from '../context/window';
import useInterval from '../hooks/interval';
import LogInArea from '../LogInArea';
import Tabs from '../Tabs';
import UserAreaContent from '../UserAreaContent';

const Rankings = React.lazy(() => import(/* webpackChunkName: "stats" */ '../Rankings'));
const Converter = React.lazy(() => import(/* webpackChunkName: "converter" */ '../Converter'));
const Modtools = React.lazy(() => import(/* webpackChunkName: "modtools" */ '../Modtools'));

const UserArea = () => {
  const name = useSelector((state) => state.user.name);
  const userlvl = useSelector((state) => state.user.userlvl);
  const lastStatsFetch = useSelector((state) => state.ranks.lastFetch);

  const { args, setArgs, setTitle } = useContext(WindowContext);
  const { activeTab = t`Profile` } = args;
  const dispatch = useDispatch();

  const setActiveTab = useCallback((label) => {
    setArgs({ activeTab: label });
    setTitle(label);
  }, [setArgs, setTitle]);

  useInterval(() => {
    if (Date.now() - 300000 > lastStatsFetch) {
      dispatch(fetchStats());
    }
  }, 300000);

  return (
    <div style={{ textAlign: 'center' }}>
      <Tabs activeTab={activeTab} setActiveTab={setActiveTab}>
        <div label={t`Profile`}>
          {name ? <UserAreaContent /> : <LogInArea />}
        </div>
        <div label={t`Statistics`}>
          <Suspense fallback={<div>Loading...</div>}>
            <Rankings />
          </Suspense>
        </div>
        <div label={t`Converter`}>
          <Suspense fallback={<div>Loading...</div>}>
            <Converter />
          </Suspense>
        </div>

        {/* New Factions tab */}
        <div label={t`Factions`}>
          {/* You can load factions.html in an iframe, or if you have a React component for factions, use it here */}
          <iframe
            src="/factions.html"
            title="Factions"
            style={{ width: '100%', height: '600px', border: 'none' }}
          />
        </div>

        {userlvl && (
          <div label={userlvl === 1 ? t`Modtools` : t`Modtools`}>
            <Suspense fallback={<div>{t`Loading...`}</div>}>
              <Modtools />
            </Suspense>
          </div>
        )}
      </Tabs>
      <br />
      {t`Consider joining us on Guilded:`}&nbsp;
      <a href="./guilded" target="_blank" rel="noopener noreferrer">
        pixelplanet.fun/guilded
      </a>
      <br />
    </div>
  );
};

export default React.memo(UserArea);
