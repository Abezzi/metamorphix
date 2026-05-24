import { useEffect } from 'react'
import Card from '@/components/ui/Card'
import Avatar from '@/components/ui/Avatar'
import GrowShrinkTag from '@/components/shared/GrowShrinkTag'
import MediaSkeleton from '@/components/shared/loaders/MediaSkeleton'
import Loading from '@/components/shared/Loading'
import { getPipelineStatistic, useAppDispatch, useAppSelector } from '../store'
import { SiJfrogpipelines } from 'react-icons/si'
import { NumericFormat } from 'react-number-format'
import type { ReactNode } from 'react'

type StatisticCardProps = {
  icon: ReactNode
  avatarClass: string
  label: string
  value?: number
  growthRate?: number
  loading: boolean
}

const StatisticCard = (props: StatisticCardProps) => {
  const { icon, avatarClass, label, value, growthRate, loading } = props

  const avatarSize = 55

  return (
    <Card bordered>
      <Loading
        loading={loading}
        customLoader={
          <MediaSkeleton
            avatarProps={{
              className: 'rounded-sm',
              width: avatarSize,
              height: avatarSize,
            }}
          />
        }
      >
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Avatar
              className={avatarClass}
              size={avatarSize}
              icon={icon}
            />
            <div>
              <span>{label}</span>
              <h3>
                <NumericFormat
                  thousandSeparator
                  displayType="text"
                  value={value}
                />
              </h3>
            </div>
          </div>
          <GrowShrinkTag value={growthRate} suffix="%" />
        </div>
      </Loading>
    </Card>
  )
}

const PipelineStatistic = () => {
  const dispatch = useAppDispatch()

  const statisticData = useAppSelector(
    (state) => state.crmPipelines.data.statisticData,
  )
  const loading = useAppSelector(
    (state) => state.crmPipelines.data.statisticLoading,
  )

  useEffect(() => {
    dispatch(getPipelineStatistic())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 mb-6">
      <StatisticCard
        icon={<SiJfrogpipelines />}
        avatarClass="bg-indigo-600!"
        label="Total Pipelines"
        value={statisticData?.totalPipelines?.value}
        growthRate={statisticData?.totalPipelines?.growShrink}
        loading={loading}
      />
      <StatisticCard
        icon={<SiJfrogpipelines />}
        avatarClass="bg-blue-500!"
        label="Active Pipelines"
        value={statisticData?.activePipelines?.value}
        growthRate={statisticData?.activePipelines?.growShrink}
        loading={loading}
      />
      <StatisticCard
        icon={<SiJfrogpipelines />}
        avatarClass="bg-emerald-500!"
        label="New Pipelines"
        value={statisticData?.newPipelines?.value}
        growthRate={statisticData?.newPipelines?.growShrink}
        loading={loading}
      />
    </div>
  )
}

export default PipelineStatistic
