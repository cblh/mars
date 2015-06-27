activities
{
    _id: ,//int
    title:,//活动标题
    desc:,//活动描述字数限制？
    date:,//活动时间
    signTime:,//报名截止时间
    startPosition: { //开始位置
        lat:,
        lon:
    },
    endPosition: { //结束位置
        lat:,
        lon:
    },
    foreignKey{
        recordId:,//关联记录
        recordId-userId://关联参加用户
    }
}

users
{
    _id: ,
    type: 0,1000，administrator
    unionId: //绑定微信账号
    nationId:,//身份证，默认null
    foreignKey{
        recordId:,//关联记录
        recordId-activityId,//关联参加活动
    }
}

records
{
    _id: ,
    activityId:,
    userId:,
    startTime://date,
    endTime://date
}