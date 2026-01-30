import { Global, Module, OnModuleInit } from '@nestjs/common';
import { ElasticsearchModule, ElasticsearchService } from '@nestjs/elasticsearch';
import { ELASTIC_SEARCH_PASSWORD, ELASTIC_SEARCH_URL, ELASTIC_SEARCH_USERNAME } from '../../common/constant/app.constant';

@Global()
@Module({
  imports: [
    ElasticsearchModule.register({
      node: ELASTIC_SEARCH_URL,
			auth: {
				username: ELASTIC_SEARCH_USERNAME!,
				password: ELASTIC_SEARCH_PASSWORD!,
			},
			tls: {
				rejectUnauthorized: false,
			},
    }),
  ],
	// export module của electicsearch để các module khác có thể sử dụng DI
	exports: [ElasticsearchModule],
})
export class ElasticSearchModule implements OnModuleInit {
	constructor(private elasticSearch: ElasticsearchService) {}

	async onModuleInit() {
		// check kết nối đến elasticsearch
		try {
			const result = await this.elasticSearch.ping();
			console.log('ElasticSearch connected', result);
		} catch (error) {
			console.error('ElasticSearch failed', error);
		}
	}
}
