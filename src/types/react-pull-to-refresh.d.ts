declare module 'react-pull-to-refresh' {
  import { ComponentType, ReactNode } from 'react';

  interface ReactPullToRefreshProps {
    onRefresh: () => Promise<any>;
    children: ReactNode;
    className?: string;
    style?: React.CSSProperties;
    pullDownThreshold?: number;
    resistance?: number;
    refreshingContent?: ReactNode;
    pullingContent?: ReactNode;
    scrollableTarget?: string;
  }

  const PullToRefresh: ComponentType<ReactPullToRefreshProps>;
  export default PullToRefresh;
}
