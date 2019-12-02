import React from 'react'
import { connect } from 'react-redux'
import { RootState } from 'internal/interface'
import { Redirect } from 'react-router-dom'
import { AppHeader } from 'internal/Header'
import { AppBody } from 'internal/AppWrapper'
import { DetailsList, DetailsListLayoutMode, CheckboxVisibility, Stack } from 'office-ui-fabric-react'
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

export const AdminUser = () => {
  return (
    <>
      <AppHeader />
      <AppBody>
        <DetailsList
          items={users}
          checkboxVisibility={CheckboxVisibility.always}
          columns={[
            {
              key: 'column_username',
              name: 'Tài khoản',
              fieldName: 'username',
              onRender(row) {
                let [a, b, c] = row.StudentName.split(' ')

                return removeAccents(`${a[0]}${b && b[0]}${c}${row.grade.split('-')[0]}`.toLowerCase())
              },
              minWidth: 100,
              maxWidth: 200,
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
              key: 'column_birth',
              name: 'Ngày sinh',
              fieldName: 'birthdate',
              minWidth: 100,
              maxWidth: 200,
              isResizable: true,
            },
            {
              key: 'column_grade',
              name: 'Niên khóa',
              onRender(row) {
                return row.grade
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
