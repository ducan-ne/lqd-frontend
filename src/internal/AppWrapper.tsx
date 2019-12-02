import React from 'react'
import { Stack, Nav } from 'office-ui-fabric-react'

export class AppBody extends React.Component {
  public render(): JSX.Element {
    return (
      <Stack tokens={{ childrenGap: 12 }} horizontal>
        <Stack.Item>
          <Nav
            selectedKey={window.location.pathname}
            selectedAriaLabel='Selected'
            ariaLabel='Nav basic example'
            styles={{
              // group: { height: '100%' },
              root: {
                width: 258,
                height: window.innerHeight - 50,
                boxSizing: 'border-box',
                border: '1px solid #eee',
                overflowY: 'auto',
              },
            }}
            groups={[
              {
                links: [
                  {
                    name: 'Trang chủ',
                    url: '/',
                    icon: 'Home',
                    key: '/',
                  },
                  {
                    name: 'Danh sách văn bản',
                    url: '/docs',
                    icon: 'Document',
                    key: '/docs',
                  },
                  {
                    name: 'Quản lý',
                    url: '#',
                    expandAriaLabel: 'Expand Home section',
                    collapseAriaLabel: 'Collapse Home section',
                    links: [
                      {
                        name: 'Tài khoản',
                        url: '/admin/user',
                        key: '/admin/user',
                      },

                      {
                        name: 'Điểm danh',
                        url: '/quan-ly-diem-danh',
                        key: '/quan-ly-diem-danh',
                      },
                      {
                        name: 'Văn bản',
                        url: '/admin/docs',
                        key: '/admin/docs',
                      },
                    ],
                    isExpanded: true,
                  },
                ],
              },
            ]}
          />
        </Stack.Item>
        <Stack.Item grow={9}>
          <div style={{ marginTop: 10, padding: 10 }}>{this.props.children}</div>
        </Stack.Item>
      </Stack>
    )
  }
}
