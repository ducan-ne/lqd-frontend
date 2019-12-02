import * as React from 'react'

import { ContextualMenu, DirectionalHint, IContextualMenuItem } from 'office-ui-fabric-react/lib/ContextualMenu'
import { FocusZone, FocusZoneDirection } from 'office-ui-fabric-react/lib/FocusZone'
import { classNamesFunction, styled } from 'office-ui-fabric-react/lib/Utilities'
import { Icon } from 'office-ui-fabric-react/lib/Icon'

import { IHeaderProps, IHeaderStyleProps, IHeaderStyles } from './Header.types'
import { getStyles } from './Header.styles'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'

console.disableYellowBox = true

export interface IHeaderState {
  contextMenu?: {
    target: HTMLElement
    items: IContextualMenuItem[]
  }
}

const getClassNames = classNamesFunction<IHeaderStyleProps, IHeaderStyles>()

export class HeaderBase extends React.Component<any, IHeaderState> {
  constructor(props: IHeaderProps) {
    super(props)

    this.state = {
      contextMenu: undefined,
    }
  }

  public render(): JSX.Element {
    const { title, styles, isLargeDown = false, theme } = this.props
    const { contextMenu } = this.state

    // For screen sizes large down, hide the side links.
    const sideLinks = isLargeDown ? [] : this.props.sideLinks

    const classNames = getClassNames(styles, { theme })
    const { subComponentStyles } = classNames

    return (
      <div>
        <div className={classNames.root}>
          {isLargeDown && (
            <button className={classNames.button} onClick={this._onMenuClick}>
              <Icon iconName='GlobalNavButton' styles={subComponentStyles.icons} />
            </button>
          )}
          <div className={classNames.title}>{title}</div>
          <div className={classNames.buttons}>
            <FocusZone direction={FocusZoneDirection.horizontal}>
              {sideLinks
                .map((link: any) => (
                  <Link key={link.url} className={classNames.button} to={link.url}>
                    {link.name}
                  </Link>
                ))
                .concat([
                  <button key='headerButtonSetting' className={classNames.button} onClick={this._onGearClick} aria-label='Settings'>
                    <Icon iconName='Settings' styles={subComponentStyles.icons} />
                  </button>,
                ])}
            </FocusZone>
          </div>
        </div>
        {contextMenu && (
          <ContextualMenu
            items={contextMenu.items}
            isBeakVisible={true}
            target={contextMenu.target}
            directionalHint={DirectionalHint.bottomAutoEdge}
            gapSpace={5}
            onDismiss={this._onDismiss}
          />
        )}
      </div>
    )
  }

  private _onRefresh = (event: any) => {
    event.preventDefault()
    this.props.refreshView()
  }

  private _onMenuClick = () => {
    const { onIsMenuVisibleChanged, isMenuVisible } = this.props

    if (onIsMenuVisibleChanged) {
      onIsMenuVisibleChanged(!isMenuVisible)
    }
  }

  private _onGearClick = (ev: React.MouseEvent<HTMLElement>): void => {
    const { contextMenu } = this.state

    this.setState({
      contextMenu: contextMenu
        ? undefined
        : {
            target: ev.currentTarget as HTMLElement,
            items: this._getOptionMenuItems(),
          },
    })
  }

  private _getOptionMenuItems(): IContextualMenuItem[] {
    return [
      {
        key: 'logout',
        name: `Đăng xuất`,
        iconProps: { iconName: 'SignOut' },
        onClick: this.props.userLogout,
      },
    ]
  }

  private _onDismiss = () => {
    this.setState({
      contextMenu: undefined,
    })
  }
}

export const HeaderComponent: React.StatelessComponent<IHeaderProps> = styled<IHeaderProps, IHeaderStyleProps, IHeaderStyles>(
  HeaderBase,
  getStyles,
  undefined,
  {
    scope: 'Header',
  },
)

export const AppHeader = () => (
  <HeaderComponent
    title='Trường THPT Chuyên Lê Quý Đôn - Khánh Hòa'
    sideLinks={
      [
        // {
        //   url: '/docs',
        //   name: 'Danh sách văn bản',
        // },
      ]
    }
    isMenuVisible={true}
  />
)
