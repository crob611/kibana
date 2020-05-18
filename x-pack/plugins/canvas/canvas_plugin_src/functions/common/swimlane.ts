/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import { ExpressionFunctionDefinition } from 'src/plugins/expressions/common';
import { getQueryFilters } from '../../../public/lib/build_embeddable_filters';
import { ExpressionValueFilter, MapCenter, TimeRange as TimeRangeArg } from '../../../types';
import {
  EmbeddableTypes,
  EmbeddableExpressionType,
  EmbeddableExpression,
} from '../../expression_types';
import { getFunctionHelp } from '../../../i18n';
import { MapEmbeddableInput } from '../../../../../legacy/plugins/maps/public';

import { AnomalySwimlaneEmbeddableInput } from '../../../../ml/public/embeddables/anomaly_swimlane/anomaly_swimlane_embeddable';

interface Arguments {
  jobId: string[];
  swimlaneType: string;
  limit: number;
  title: string | null;
  viewBy: string | null;
}

type Output = EmbeddableExpression<AnomalySwimlaneEmbeddableInput>;

export function swimlane(): ExpressionFunctionDefinition<
  'swimlane',
  ExpressionValueFilter | null,
  Arguments,
  Output
> {
  const { help, args: argHelp } = getFunctionHelp().savedMap;
  return {
    name: 'swimlane',
    help,
    args: {
      jobId: {
        types: ['string'],
        required: true,
        multi: true,
      },
      swimlaneType: {
        types: ['string'],
        required: true,
        multi: false,
      },
      limit: {
        types: ['number'],
        required: true,
        multi: false,
      },
      title: {
        types: ['string'],
        help: argHelp.title,
        required: false,
      },
      viewBy: {
        types: ['string'],
        required: false,
      },
    },
    type: EmbeddableExpressionType,
    fn: (input, args) => {
      return {
        type: EmbeddableExpressionType,
        input: {
          id: 'yo',
          jobIds: args.jobId,
          swimlaneType: args.swimlaneType,
          title: args.title || '',
          limit: args.limit,
          filters: [],
          query: {
            language: 'kuery',
            query: '',
          },
          timeRange: {
            from: 'now-30d',
            to: 'now',
          },
          viewBy: args.viewBy,
        },
        embeddableType: 'ml_anomaly_swimlane',
      };
    },
  };
}

/*
input:
id: "0e01124c-cc4a-406a-b65d-cbad18352b46"
jobIds: ["high_sum_total_sales"]
title: "ML anomaly swimlane for high_sum_total_sales"
swimlaneType: "overall"
viewBy: undefined
limit: 5
*/
