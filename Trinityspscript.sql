Use TrinityDB
GO
/****** Object:  Table [dbo].[tbl_right_master]    Script Date: 25-02-2018 20:27:48 ******/
DROP TABLE [dbo].[tbl_right_master]
GO
/****** Object:  Table [dbo].[tbl_right_master]    Script Date: 25-02-2018 20:27:48 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
CREATE TABLE [dbo].[tbl_right_master](
	[RightID] [int] NULL,
	[RightName] [varchar](255) NULL,
	[MenuName] [varchar](255) NULL,
	[Path] [varchar](255) NULL,
	[Icon] [varchar](255) NULL,
	[ShowMenu] [varchar](255) NULL,
	[IsActive] [varchar](2) NULL
) ON [PRIMARY]

GO
SET ANSI_PADDING OFF
GO
INSERT [dbo].[tbl_right_master] ([RightID], [RightName], [MenuName], [Path], [Icon], [ShowMenu], [IsActive]) VALUES (1, N'Home', N'Home', N'Index', N'fa fa-dashboard', N'true', N'Y')
GO
INSERT [dbo].[tbl_right_master] ([RightID], [RightName], [MenuName], [Path], [Icon], [ShowMenu], [IsActive]) VALUES (2, N'LTA Read Only', N' LTA Strategy Inventory', N'ModelAlgoManagement', N'fa fa-list', N'true', N'Y')
GO
INSERT [dbo].[tbl_right_master] ([RightID], [RightName], [MenuName], [Path], [Icon], [ShowMenu], [IsActive]) VALUES (3, N'LTA Write Access', N' LTA Strategy Inventory', N'ModelAlgoManagement', N'fa fa-list', N'true', N'Y')
GO
INSERT [dbo].[tbl_right_master] ([RightID], [RightName], [MenuName], [Path], [Icon], [ShowMenu], [IsActive]) VALUES (4, N'LTA Strategy Owner', N' LTA Strategy Inventory', N'ModelAlgoManagement', N'fa fa-list', N'true', N'Y')
GO
INSERT [dbo].[tbl_right_master] ([RightID], [RightName], [MenuName], [Path], [Icon], [ShowMenu], [IsActive]) VALUES (6, N'Role Management Read', N'Role Management', N'RoleManagement', N'fa fa-list-alt', N'true', N'Y')
GO
INSERT [dbo].[tbl_right_master] ([RightID], [RightName], [MenuName], [Path], [Icon], [ShowMenu], [IsActive]) VALUES (7, N'Role Management Write', N'Role Management', N'RoleManagement', N'fa fa-list-alt', N'true', N'Y')
GO
INSERT [dbo].[tbl_right_master] ([RightID], [RightName], [MenuName], [Path], [Icon], [ShowMenu], [IsActive]) VALUES (8, N'User Management Read', N'User Management', N'UserManagement', N'fa fa-users', N'true', N'Y')
GO
INSERT [dbo].[tbl_right_master] ([RightID], [RightName], [MenuName], [Path], [Icon], [ShowMenu], [IsActive]) VALUES (9, N'User Management Write', N'User Management', N'UserManagement', N'fa fa-users', N'true', N'Y')
GO
INSERT [dbo].[tbl_right_master] ([RightID], [RightName], [MenuName], [Path], [Icon], [ShowMenu], [IsActive]) VALUES (10, N'Master Page Read', N'Master Page', N'MasterPage', N'fa fa-star', N'true', N'Y')
GO
INSERT [dbo].[tbl_right_master] ([RightID], [RightName], [MenuName], [Path], [Icon], [ShowMenu], [IsActive]) VALUES (11, N'Master Page Write', N'Master Page', N'MasterPage', N'fa fa-star', N'true', N'Y')
GO
INSERT [dbo].[tbl_right_master] ([RightID], [RightName], [MenuName], [Path], [Icon], [ShowMenu], [IsActive]) VALUES (12, N'Mapping Page Read', N'Mapping Page', N'MappingMaster', N'fa fa-star-o', N'true', N'Y')
GO
INSERT [dbo].[tbl_right_master] ([RightID], [RightName], [MenuName], [Path], [Icon], [ShowMenu], [IsActive]) VALUES (13, N'Mapping Page Write', N'Mapping Page', N'MappingMaster', N'fa fa-star-o', N'true', N'Y')
GO
INSERT [dbo].[tbl_right_master] ([RightID], [RightName], [MenuName], [Path], [Icon], [ShowMenu], [IsActive]) VALUES (14, N'Reports', N'Report', N'Reports', N'fa fa-list-alt', N'true', N'Y')
GO
INSERT [dbo].[tbl_right_master] ([RightID], [RightName], [MenuName], [Path], [Icon], [ShowMenu], [IsActive]) VALUES (5, N'LTA Application Inventory', N'LTA Application Inventory', N'ReportApplicationMapping', N'fa fa-archive', N'true', N'Y')
GO
ALTER TABLE [dbo].[tbl_right_master] ADD  DEFAULT (NULL) FOR [RightID]
GO
ALTER TABLE [dbo].[tbl_right_master] ADD  DEFAULT (NULL) FOR [RightName]
GO
ALTER TABLE [dbo].[tbl_right_master] ADD  DEFAULT (NULL) FOR [MenuName]
GO
ALTER TABLE [dbo].[tbl_right_master] ADD  DEFAULT (NULL) FOR [Path]
GO
ALTER TABLE [dbo].[tbl_right_master] ADD  DEFAULT (NULL) FOR [Icon]
GO
ALTER TABLE [dbo].[tbl_right_master] ADD  DEFAULT (NULL) FOR [ShowMenu]
GO
ALTER TABLE [dbo].[tbl_right_master] ADD  DEFAULT (NULL) FOR [IsActive]
GO
