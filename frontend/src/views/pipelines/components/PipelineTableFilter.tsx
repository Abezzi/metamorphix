import Select from '@/components/ui/Select'
import Badge from '@/components/ui/Badge'
import { setFilterData, useAppDispatch, useAppSelector } from '../store'
import {
  components,
  ControlProps,
  OptionProps,
  SingleValue,
} from 'react-select'
import { HiCheck } from 'react-icons/hi'

type Option = {
  value: string | boolean
  label: string
  color: string
}

const { Control } = components

const options: Option[] = [
  { value: '', label: 'All', color: 'bg-gray-500' },
  { value: true, label: 'Active', color: 'bg-emerald-500' },
  { value: false, label: 'Blocked', color: 'bg-red-500' },
]

const CustomSelectOption = ({
  innerProps,
  label,
  data,
  isSelected,
}: OptionProps<Option>) => {
  return (
    <div
      className={`flex items-center justify-between p-2 cursor-pointer ${isSelected
          ? 'bg-gray-100 dark:bg-gray-500'
          : 'hover:bg-gray-50 dark:hover:bg-gray-600'
        }`}
      {...innerProps}
    >
      <div className="flex items-center gap-2">
        <Badge innerClass={data.color} />
        <span>{label}</span>
      </div>
      {isSelected && <HiCheck className="text-emerald-500 text-xl" />}
    </div>
  )
}

const CustomControl = ({ children, ...props }: ControlProps<Option>) => {
  const selected = props.getValue()[0]
  return (
    <Control {...props}>
      {selected && (
        <Badge
          className="ltr:ml-4 rtl:mr-4"
          innerClass={selected.color}
        />
      )}
      {children}
    </Control>
  )
}

const PipelineTableFilter = () => {
  const dispatch = useAppDispatch()

  const { isActive } = useAppSelector(
    (state) => state.crmPipelines.data.filterData,
  )

  const onIsActiveFilterChange = (selected: SingleValue<Option>) => {
    dispatch(setFilterData({ isActive: selected?.value }))
  }

  return (
    <Select<Option>
      options={options}
      size="sm"
      className="mb-4 min-w-[130px]"
      components={{
        Option: CustomSelectOption,
        Control: CustomControl,
      }}
      value={options.filter((option) => option.value === isActive)}
      onChange={onIsActiveFilterChange}
    />
  )
}

export default PipelineTableFilter
