import React from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Card } from 'antd';
import styles from './home.less';

export default (): React.ReactNode => {
  return (
    <PageContainer pageHeaderRender={false} title={false} breadcrumbRender={false} ghost={false}>
      <Card>
        这是首页
      </Card>
    </PageContainer>
  );
};
