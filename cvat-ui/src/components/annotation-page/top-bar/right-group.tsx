// Copyright (C) 2021 Intel Corporation
//
// SPDX-License-Identifier: MIT

import Icon from '@ant-design/icons';
import { changeAnnotationsFilters, fetchAnnotationsAsync } from 'actions/annotation-actions';
import Button from 'antd/lib/button';
import { Col } from 'antd/lib/grid';
import Select from 'antd/lib/select';
import { FilterIcon, FullscreenIcon, InfoIcon } from 'icons';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CombinedState, DimensionType, Workspace } from 'reducers/interfaces';

interface Props {
    workspace: Workspace;
    showStatistics(): void;
    showFilters(): void;
    changeWorkspace(workspace: Workspace): void;
    jobInstance: any;
}

function RightGroup(props: Props): JSX.Element {
    const {
        showFilters, showStatistics, changeWorkspace, workspace, jobInstance,
    } = props;

    const filters = useSelector((state: CombinedState) => state.annotation.annotations.filters);
    const dispatch = useDispatch();
    const filtersClickHandler = (e: React.MouseEvent<HTMLElement, MouseEvent>): void => {
        if (e.altKey) {
            dispatch(changeAnnotationsFilters([]));
            dispatch(fetchAnnotationsAsync());
        } else {
            showFilters();
        }
    };

    return (
        <Col className='cvat-annotation-header-right-group'>
            <Button
                type='link'
                className='cvat-annotation-header-button'
                onClick={(): void => {
                    if (window.document.fullscreenEnabled) {
                        if (window.document.fullscreenElement) {
                            window.document.exitFullscreen();
                        } else {
                            window.document.documentElement.requestFullscreen();
                        }
                    }
                }}
            >
                <Icon component={FullscreenIcon} />
                Fullscreen
            </Button>
            <Button type='link' className='cvat-annotation-header-button' onClick={showStatistics}>
                <Icon component={InfoIcon} />
                Info
            </Button>
            <Button
                type='link'
                className={`cvat-annotation-header-button ${filters.length ? 'filters-armed' : ''}`}
                onClick={(e: React.MouseEvent<HTMLElement, MouseEvent>) => filtersClickHandler(e)}
            >
                <Icon component={FilterIcon} />
                Filters
            </Button>
            <div>
                <Select
                    dropdownClassName='cvat-workspace-selector-dropdown'
                    className='cvat-workspace-selector'
                    onChange={changeWorkspace}
                    value={workspace}
                >
                    {Object.values(Workspace).map((ws) => {
                        if (jobInstance.task.dimension === DimensionType.DIM_3D) {
                            if (ws === Workspace.STANDARD) {
                                return null;
                            }
                            return (
                                <Select.Option disabled={ws !== Workspace.STANDARD3D} key={ws} value={ws}>
                                    {ws}
                                </Select.Option>
                            );
                        }
                        if (ws !== Workspace.STANDARD3D) {
                            return (
                                <Select.Option key={ws} value={ws}>
                                    {ws}
                                </Select.Option>
                            );
                        }
                        return null;
                    })}
                </Select>
            </div>
        </Col>
    );
}

export default React.memo(RightGroup);
