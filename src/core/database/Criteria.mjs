
///
const SQL_OPTIONS = new Map([
    ['equals', '='],
    ['eq', '='],
    ['negation', '!='],
    ['ne', '!='],
    ['greaterThan', '>'],
    ['gt', '>'],
    ['greaterThanOrEqual', '>='],
    ['gte', '>='],
    ['lessThan', '<'],
    ['lt', '<'],
    ['lessThanOrEqual', '<='],
    ['lte', '<='],
    ['lk', 'like'],
    ['like', 'like'],
    ['in', 'in'],
    ['notIn', 'not in'],
    ['nin', 'not in'],
    ['isNull', 'is null'],
    ['nul', 'is null'],
    ['between', 'between'],
    ['be', 'between']
]);

/** Criteria
 *
 */
export class Criteria {

    #filters = [];
    #order = [];

    #limit = null;
    #offset = null;

    /**
     *
     * @returns {Criteria}
     */
    addFilter(field, operator, value) {

        operator = SQL_OPTIONS.get(operator) ?? operator;

        this.#filters.push({ field, operator, value });

        return this;

    }

    /**
     *
     * @returns {Object}
     */
    getFilters() {

        return this.#filters;

    }

    /**
     *
     * @param {String} field
     * @param {String} direction    default: ASC
     * @returns {Criteria}
     */
    setOrderBy(field, direction = 'ASC') {

        this.#order.push({ field, direction });

        return this;

    }

    /**
     *
     * @returns {Object}
     */
    getOrderBy() {

        return this.#order;

    }

    /**
     *
     * @param {Number} value
     * @returns {Criteria}
     */
    setLimit(value) {

        if (isNaN(value))
            throw new TypeError(`${this.constructor.name}.setLimit: @param 'value' must be a number`);

        this.#limit = value;

        return this;

    }

    /**
     *
     * @param {Number} value
     * @returns {Criteria}
     */
    setOffset(value) {

        if (isNaN(value))
            throw new TypeError(`${this.constructor.name}.setOffset: @param 'value' must be a number`);

        this.#offset = value;

        return this;

    }

    /**
     *
     * @returns {Object}
     */
    getPagination() {

        const output = {};

        if (this.#limit !== null)
            output.limit = this.#limit;

        if (this.#offset !== null)
            output.offset = this.#offset;

        return output;

    }

    /** create
     *
     * @returns {Criteria}
     */
    static create() {

        return new Criteria();

    }

    /** fromQueryString
     *
     * @param {String} queryString  ?offset=0&limit=10&orderBy:desc=__column__&__where__
     * @param {Array} fields
     * @return {Criteria}
     */
    static fromQueryString(queryString, fields=[]) {

        if (typeof queryString != 'string')
            throw new TypeError(`Criteria.fromQueryString: @param 'queryString' must be a string`);

        const inputs = queryString.replace(/^\?/, '').split('&').map(e => e.split('='));

        const criteria = new this();

        for (const [key, value] of inputs) {

            const [name, option] = key.split(':');

            switch (name) {
                case 'offset':
                    criteria.setOffset( parseInt(value) );
                    break;
                case 'limit':
                    criteria.setLimit( parseInt(value) );
                    break;
                case 'orderBy':
                    criteria.setOrderBy( value, option || 'ASC' );
                    break;
                default:
                    if (fields.includes(name))
                        criteria.addFilter(name, option, value);
                    break;
            }

        }

        return criteria;

    }

}
