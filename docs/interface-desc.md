#20150626interface description
##resource of statistics //统计
###interface of rank
{
	retCode: 0,1,2 //成功，失败，
	rank: {
		{
			unionId:1234,//int
			totalVolunteerTime:12434,//int,毫秒

		},
	}
}

##resource of activities
创建活动 create
更新活动 update
删除活动 

##resource of volunteer
create user
{
	unionId:1234,//绑定微信账号
	nationId:,//身份证
	activities:
	{
		
	}
}

}

