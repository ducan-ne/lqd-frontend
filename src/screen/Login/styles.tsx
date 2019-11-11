import React from 'react'
import { Stack } from 'office-ui-fabric-react'
import styled from 'styled-components'
import { Card } from '@uifabric/react-cards'

const Background = styled.div`
  position: fixed;
  top: 0px;
  width: 100%;
  height: 100%;
  & > div {
    position: fixed;
    top: 0px;
    width: 100%;
    height: 100%;
    background-repeat: no-repeat, no-repeat;
    background-position: center center, center center;
    background-size: cover, cover;
  }
`

const BackgroundFull = styled.div`
  background-image: url(https://source.unsplash.com/daily);
`

export const Outer = styled.div`
  display: table;
  position: absolute;
  height: 95%;
  width: 100%;
  margin: 0 0 0 -50%;
`
export const Middle = styled.div`
  display: table-cell;
  vertical-align: middle;
`

export const Inner = styled(Card)`
  margin-left: auto;
  margin-right: auto;
  position: relative;
  min-height: 338px;
  width: calc(100% - 40px);
  padding: 14px;
  margin-bottom: 28px;
  background-color: #fff;

  box-shadow: 0 2px 3px rgba(0, 0, 0, 0.55);
  border: 1px solid rgba(0, 0, 0, 0.4);
`

export const Wrapper = (props: any) => {
  return (
    <Stack tokens={{ childrenGap: 50 }}>
      <Background>
        <BackgroundFull />
      </Background>
      <Stack horizontal horizontalAlign='center' tokens={{ childrenGap: 15 }}>
        <Stack.Item align='center'>
          <Outer>
            <Middle>
              <Inner
                tokens={{ maxWidth: 440, childrenMargin: 30, minWidth: 320 }}
              >
                <Card.Section>{props.children}</Card.Section>
              </Inner>
            </Middle>
          </Outer>
        </Stack.Item>
      </Stack>
    </Stack>
  )
}
