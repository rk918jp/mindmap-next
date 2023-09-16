import * as React from "react";

import { FC, ReactNode, useEffect } from "react";
import type { EmotionCache } from "@emotion/cache";
import { CacheProvider } from "@emotion/react";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import { AppProps } from "next/app";
import Head from "next/head";

import { Provider } from "react-redux";
import { initialEdges, initialNodes } from "@/consts/mindmap";
import createEmotionCache from "@/createEmotionCache";
import { useAppDispatch, useAppSelector } from "@/hooks/store";
import { appStore } from "@/store";
import { init } from "@/store/mindmap";
import theme from "@/theme";

const clientSideEmotionCache = createEmotionCache();

export interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache;
}

// mindmapの初期データを登録
const AppInitializer: FC<{ children: ReactNode }> = ({ children }) => {
  const dispatch = useAppDispatch();
  const initialized = useAppSelector((state) => state.mindmap.initialized);

  useEffect(() => {
    if (!initialized) {
      // TODO: APIからデータ取得
      dispatch(
        init({
          pages: [
            {
              id: crypto.randomUUID(),
              name: "Page 1",
              sortOrder: 1,
              nodes: initialNodes,
              edges: initialEdges,
            },
          ],
        }),
      );
    }
  }, [initialized]);
  return <>{children}</>;
};

export default function MyApp(props: MyAppProps) {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;

  return (
    <Provider store={appStore}>
      <CacheProvider value={emotionCache}>
        <Head>
          <meta name="viewport" content="initial-scale=1, width=device-width" />
        </Head>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <AppInitializer>
            <Component {...pageProps} />
          </AppInitializer>
        </ThemeProvider>
      </CacheProvider>
    </Provider>
  );
}
