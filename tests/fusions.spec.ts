import * as assert from 'assert';
import { any } from '../src/parsers/any';
import { str, stri } from '../src/parsers/str';
import { toggleFusions } from '../src/parsers/utilities';
import { Context, Parser } from '../src/types';
import { mochaLog } from './logging.spec';

describe('fusions should be faster than non-fused parsers', () => {
    it(`case: any(any(str('QeQMTvqJuS'), str('ErEmTDUUIF')), any(str('IoOYSLNPlM'), str('SpFMUWpzHs'))) -> 'ImWebhqJMcErEmTDUUIFcFpsAJhfwqXN' x 10_000`, function() {
        const parserFused = any(any(str('QeQMTvqJuS'), str('ErEmTDUUIF')), any(str('IoOYSLNPlM'), str('SpFMUWpzHs')));

        toggleFusions(false);
        const parserNonFused = any(any(str('QeQMTvqJuS'), str('ErEmTDUUIF')), any(str('IoOYSLNPlM'), str('SpFMUWpzHs')));
        toggleFusions(true);

        const context: Context = { index: 0, path: '', text: 'ImWebhqJMcErEmTDUUIFcFpsAJhfwqXN' };

        checkFusion(parserFused, parserNonFused, context, 10000);
    });

    it(`case: any(str('QeQMTvqJuS'), stri('QeQMTvqJuS'), str('QeqmtabeacErEmTDUUIFcFpsAJhfwqXN'), str('SpFMUWpzHs')) -> 'QeqmtabeacErEmTDUUIFcFpsAJhfwqXN' x 10_000`, function() {
        const parserFused = any(str('QeQMTvqJuS'), stri('QeQMTvqJuS'), str('QeqmtabeacErEmTDUUIFcFpsAJhfwqXN'), str('SpFMUWpzHs'));

        toggleFusions(false);
        const parserNonFused = any(str('QeQMTvqJuS'), stri('QeQMTvqJuS'), str('QeqmtabeacErEmTDUUIFcFpsAJhfwqXN'), str('SpFMUWpzHs'));
        toggleFusions(true);

        const context: Context = { index: 0, path: '', text: 'QeqmtabeacErEmTDUUIFcFpsAJhfwqXN' };

        checkFusion(parserFused, parserNonFused, context, 10000);
    });

    it(`case: any(str('jKUuKrxuKm'), ..., stri('olFldPZKYF')) -> 'ImWebhqJMcErEmTDUUIFcFpsAJhfwqXN' x 1_000`, function() {
        const parserFused = any(
            str('jKUuKrxuKm'),
            str('ywNOFmhnRh'),
            str('nIiYyVBaOz'),
            str('qmCdSCzAwb'),
            str('epLrNxBQgl'),
            str('JQNUEVNvco'),
            str('nmGuoTWDJz'),
            str('SaLTTYuqbY'),
            str('CpSJjcYaPh'),
            str('xILcYpOLpx'),
            str('yqFlmbSFPK'),
            stri('sixiYxJizK'),
            stri('yjqLUEpuUJ'),
            stri('VeVxkVaqKv'),
            stri('qSCUWGxkHt'),
            stri('EuAPMOevXm'),
            stri('WsMosTuXWu'),
            stri('GqKKqoguqr'),
            stri('XISDJJlhpv'),
            stri('OWvRVXxZZr'),
            stri('EeeNViuver'),
            stri('NldKAvAKXW'),
            stri('bsTUlEosYW'),
            stri('CixASiwFRI'),
            stri('yNzvVcWver'),
            stri('xYVPlaaYRb'),
            stri('KbFIlLoCcB'),
            stri('XuVOIUlXSf'),
            stri('ylXTVvRuwO'),
            stri('olFldPZKYF')
        );

        toggleFusions(false);
        const parserNonFused = any(
            str('jKUuKrxuKm'),
            str('ywNOFmhnRh'),
            str('nIiYyVBaOz'),
            str('qmCdSCzAwb'),
            str('epLrNxBQgl'),
            str('JQNUEVNvco'),
            str('nmGuoTWDJz'),
            str('SaLTTYuqbY'),
            str('CpSJjcYaPh'),
            str('xILcYpOLpx'),
            str('yqFlmbSFPK'),
            stri('sixiYxJizK'),
            stri('yjqLUEpuUJ'),
            stri('VeVxkVaqKv'),
            stri('qSCUWGxkHt'),
            stri('EuAPMOevXm'),
            stri('WsMosTuXWu'),
            stri('GqKKqoguqr'),
            stri('XISDJJlhpv'),
            stri('OWvRVXxZZr'),
            stri('EeeNViuver'),
            stri('NldKAvAKXW'),
            stri('bsTUlEosYW'),
            stri('CixASiwFRI'),
            stri('yNzvVcWver'),
            stri('xYVPlaaYRb'),
            stri('KbFIlLoCcB'),
            stri('XuVOIUlXSf'),
            stri('ylXTVvRuwO'),
            stri('olFldPZKYF')
        );
        toggleFusions(true);

        const context: Context = { index: 0, path: '', text: 'ImWebhqJMcErEmTDUUIFcFpsAJhfwqXN' };

        checkFusion(parserFused, parserNonFused, context, 1000);
    });

});

function checkFusion<T>(parserFused: Parser<T>, parserNonFused: Parser<T>, context: Context, times: number) {
    // pre-heating
    for (let index = 0; index < 1000; index++) {
        parserFused(context);
    }
    for (let index = 0; index < 1000; index++) {
        parserNonFused(context);
    }
    
    const fusedResults: ReturnType<typeof parserFused>[] = new Array(times);
    const fusedStart = performance.now();
    for (let index = 0; index < times; index++) {
        fusedResults.push(parserFused(context));
    }
    const fusedTime = performance.now() - fusedStart;

    const nonFusedResults: ReturnType<typeof parserNonFused>[] = new Array(times);
    const nonFusedStart = performance.now();
    for (let index = 0; index < times; index++) {
        nonFusedResults.push(parserNonFused(context));
    }
    const nonFusedTime = performance.now() - nonFusedStart;

    mochaLog('Fused parsing:', fusedTime.toFixed(2) + 'ms');
    mochaLog('Non-fused parsing:', nonFusedTime.toFixed(2) + 'ms');
    assert.deepEqual(fusedResults[0], nonFusedResults[0], 'Fused and non-fused parsing should generate the same output');
    assert.ok(nonFusedTime > fusedTime, 'Fused parsing should be faster than non-fused parsing');
}
