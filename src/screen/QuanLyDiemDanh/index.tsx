import React from 'react'
import { connect } from 'react-redux'
import { RootState } from 'internal/interface'
import { Redirect } from 'react-router-dom'
import { AppHeader } from 'internal/Header'
import { AppBody } from 'internal/AppWrapper'
import { Image, DetailsList, DetailsListLayoutMode, CheckboxVisibility, Stack, Link } from 'office-ui-fabric-react'
import { users } from './users'
import _ from 'lodash'

function removeAccents(str: string) {
  var AccentsMap = [
    'aàảãáạăằẳẵắặâầẩẫấậ',
    'AÀẢÃÁẠĂẰẲẴẮẶÂẦẨẪẤẬ',
    'dđ',
    'DĐ',
    'eèẻẽéẹêềểễếệ',
    'EÈẺẼÉẸÊỀỂỄẾỆ',
    'iìỉĩíị',
    'IÌỈĨÍỊ',
    'oòỏõóọôồổỗốộơờởỡớợ',
    'OÒỎÕÓỌÔỒỔỖỐỘƠỜỞỠỚỢ',
    'uùủũúụưừửữứự',
    'UÙỦŨÚỤƯỪỬỮỨỰ',
    'yỳỷỹýỵ',
    'YỲỶỸÝỴ',
  ]
  for (var i = 0; i < AccentsMap.length; i++) {
    var re = new RegExp('[' + AccentsMap[i].substr(1) + ']', 'g')
    var char = AccentsMap[i][0]
    str = str.replace(re, char)
  }
  return str
}

export const QuanLyDiemDanh = () => {
  return (
    <>
      <AppHeader />
      <AppBody>
        <DetailsList
          items={users}
          checkboxVisibility={CheckboxVisibility.always}
          columns={[
            {
              key: 'column_avatar',
              name: 'Ảnh',
              onRender(row) {
                return <Image width='32px' height='32px' src={`http://service.mmlab.uit.edu.vn/checkinService/datasql_api/${row.Avatar}`} />
              },
              minWidth: 100,
              maxWidth: 100,
              isResizable: true,
            },
            {
              key: 'column_name',
              name: 'Tên',
              fieldName: 'StudentName',
              minWidth: 100,
              maxWidth: 200,
              isResizable: true,
            },
            {
              key: 'column_class',
              name: 'Lớp học',
              fieldName: 'className',
              onRender(row) {
                return row.className
              },
              minWidth: 100,
              maxWidth: 200,
              isResizable: true,
            },
            {
              key: 'column_scope',
              name: 'Xác thực',
              onRender(row) {
                let score = row.Score
                if (score > 0.8) return '98% khớp'
                if (score > 0.5) return '90% khớp'
                return <Link>Đăng ký</Link>
              },
              minWidth: 100,
              maxWidth: 200,
              isResizable: true,
            },
            {
              key: 'column_time',
              name: 'Thời gian',
              onRender(row, index) {
                let times = ['vài tiếng trước', '1 ngày trước', 'vài ngày trước', '1 tuần trước']
                return times[(times.length % index!) - 1] || 'vài tiếng trước'
              },
              minWidth: 100,
              maxWidth: 200,
              isResizable: true,
            },
          ]}
          setKey='set'
          layoutMode={DetailsListLayoutMode.justified}
          selectionPreservedOnEmptyClick={true}
          ariaLabelForSelectionColumn='Toggle selection'
          ariaLabelForSelectAllCheckbox='Toggle selection for all items'
          checkButtonAriaLabel='Row checkbox'
        />
      </AppBody>
    </>
  )
}
