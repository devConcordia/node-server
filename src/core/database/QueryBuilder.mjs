import {Criteria} from './Criteria.mjs';

/** QueryBuilder
 *
 */
export class QueryBuilder {

    /** fromCriteria
     *
     * @param {Criteria} criteria
     * @param {String} tableName
     * @return {String}
     */
    static fromCriteria(tableName, criteria) {

        if (!(criteria instanceof Criteria))
            throw new TypeError(`QueryBuilder.fromCriteria: @param 'criteria' must be a Criteria`);

        if (typeof tableName !== 'string')
            throw new TypeError(`QueryBuilder.fromCriteria: @param 'tableName' must be a string`);

        const clauses = [];
        const params = {};

        criteria.getFilters().forEach((filter, index) => {

            const key = `p${index}`;

            if (filter.operator) {
                clauses.push(`${filter.field} ${filter.operator} :${key}`);
            } else {
                clauses.push(`${filter.field} = :${key}`);
            }

            params[key] = filter.value;

        });

        const query = [ `select * from ${tableName}` ];

        if (clauses.length > 0)
            query.push( `where ${clauses.join(' AND ')}` );

        const ordinations = criteria.getOrderBy().map(o => `${o.field} ${o.direction}`);

        if (ordinations.length > 0)
            query.push( `order by ${ordinations.join(', ')}` );

        const { limit, offset } = criteria.getPagination();

        if (limit > 0)
            query.push( `limit ${limit}` );

        if (offset > 0)
            query.push( `offset ${offset}` );

        return {
            query: query.join(' '),
            params
        };

    }

}
