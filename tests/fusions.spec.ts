import * as assert from 'assert';
import { any, str, stri, map } from '../src/parsers';
import { Context, Parser } from '../src/types';
import { mochaLog } from './logging.spec';
import { toggleFusions } from '../src/parsers/optimizations';

describe('fusions should be faster than non-fused parsers', () => {
    it(`case: any(any(str('QeQMTvqJuS'), stri('ErEmTDUUIF')), any(str('IoOYSLNPlM'), stri('SpFMUWpzHs')), any(str('QeQMTvqJuS'), stri('ErEmTDUUIF')), any(str('IoOYSLNPlM'), stri('SpFMUWpzHs')), any(str('QeQMTvqJuS'), stri('ErEmTDUUIF')), any(str('IoOYSLNPlM'), stri('SpFMUWpzHs'))) -> 'ImWebhqJMcErEmTDUUIFcFpsAJhfwqXN' x 10_000`, function() {
        const parserFused = any(any(str('QeQMTvqJuS'), stri('ErEmTDUUIF')), any(str('IoOYSLNPlM'), stri('SpFMUWpzHs')), any(str('QeQMTvqJuS'), stri('ErEmTDUUIF')), any(str('IoOYSLNPlM'), stri('SpFMUWpzHs')), any(str('QeQMTvqJuS'), stri('ErEmTDUUIF')), any(str('IoOYSLNPlM'), stri('SpFMUWpzHs')));

        toggleFusions(false);
        const parserNonFused = any(any(str('QeQMTvqJuS'), stri('ErEmTDUUIF')), any(str('IoOYSLNPlM'), stri('SpFMUWpzHs')), any(str('QeQMTvqJuS'), stri('ErEmTDUUIF')), any(str('IoOYSLNPlM'), stri('SpFMUWpzHs')), any(str('QeQMTvqJuS'), stri('ErEmTDUUIF')), any(str('IoOYSLNPlM'), stri('SpFMUWpzHs')));
        toggleFusions(true);

        const context: Context = { index: 0, path: '', text: 'ImWebhqJMcErEmTDUUIFcFpsAJhfwqXN' };

        checkFusion(parserFused, parserNonFused, context, 10000);
    });

    it(`case: any(str('QeQMTvqJuS'), stri('ErEmTDUUIF'), str('IoOYSLNPlM'), stri('SpFMUWpzHs'), str('QeQMTvqJuS'), stri('ErEmTDUUIF'), str('IoOYSLNPlM'), stri('SpFMUWpzHs'), str('QeQMTvqJuS'), stri('ErEmTDUUIF'), str('IoOYSLNPlM'), stri('SpFMUWpzHs')) -> 'QeqmtabeacErEmTDUUIFcFpsAJhfwqXN' x 10_000`, function() {
        const parserFused = any(str('QeQMTvqJuS'), stri('ErEmTDUUIF'), str('IoOYSLNPlM'), stri('SpFMUWpzHs'), str('QeQMTvqJuS'), stri('ErEmTDUUIF'), str('IoOYSLNPlM'), stri('SpFMUWpzHs'), str('QeQMTvqJuS'), stri('ErEmTDUUIF'), str('IoOYSLNPlM'), stri('SpFMUWpzHs'));

        toggleFusions(false);
        const parserNonFused = any(str('QeQMTvqJuS'), stri('ErEmTDUUIF'), str('IoOYSLNPlM'), stri('SpFMUWpzHs'), str('QeQMTvqJuS'), stri('ErEmTDUUIF'), str('IoOYSLNPlM'), stri('SpFMUWpzHs'), str('QeQMTvqJuS'), stri('ErEmTDUUIF'), str('IoOYSLNPlM'), stri('SpFMUWpzHs'));
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

    it(`case: any(map(str('jKUuKrxuKm'), () => 1), ..., map(stri('olFldPZKYF'), () => 30)) -> 'ImWebhqJMcErEmTDUUIFcFpsAJhfwqXN' x 1_000`, function() {
        const parserFused = any(
            map(str('jKUuKrxuKm'), () => 1),
            map(str('ywNOFmhnRh'), () => 2),
            map(str('nIiYyVBaOz'), () => 3),
            map(str('qmCdSCzAwb'), () => 4),
            map(str('epLrNxBQgl'), () => 5),
            map(str('JQNUEVNvco'), () => 6),
            map(str('nmGuoTWDJz'), () => 7),
            map(str('SaLTTYuqbY'), () => 8),
            map(str('CpSJjcYaPh'), () => 9),
            map(str('xILcYpOLpx'), () => 10),
            map(str('yqFlmbSFPK'), () => 11),
            map(stri('sixiYxJizK'), () => 12),
            map(stri('yjqLUEpuUJ'), () => 13),
            map(stri('VeVxkVaqKv'), () => 14),
            map(stri('qSCUWGxkHt'), () => 15),
            map(stri('EuAPMOevXm'), () => 16),
            map(stri('WsMosTuXWu'), () => 17),
            map(stri('GqKKqoguqr'), () => 18),
            map(stri('XISDJJlhpv'), () => 19),
            map(stri('OWvRVXxZZr'), () => 20),
            map(stri('EeeNViuver'), () => 21),
            map(stri('NldKAvAKXW'), () => 22),
            map(stri('bsTUlEosYW'), () => 23),
            map(stri('CixASiwFRI'), () => 24),
            map(stri('yNzvVcWver'), () => 25),
            map(stri('xYVPlaaYRb'), () => 26),
            map(stri('KbFIlLoCcB'), () => 27),
            map(stri('XuVOIUlXSf'), () => 28),
            map(stri('ylXTVvRuwO'), () => 29),
            map(stri('olFldPZKYF'), () => 30),
        );

        toggleFusions(false);
        const parserNonFused = any(
            map(str('jKUuKrxuKm'), () => 1),
            map(str('ywNOFmhnRh'), () => 2),
            map(str('nIiYyVBaOz'), () => 3),
            map(str('qmCdSCzAwb'), () => 4),
            map(str('epLrNxBQgl'), () => 5),
            map(str('JQNUEVNvco'), () => 6),
            map(str('nmGuoTWDJz'), () => 7),
            map(str('SaLTTYuqbY'), () => 8),
            map(str('CpSJjcYaPh'), () => 9),
            map(str('xILcYpOLpx'), () => 10),
            map(str('yqFlmbSFPK'), () => 11),
            map(stri('sixiYxJizK'), () => 12),
            map(stri('yjqLUEpuUJ'), () => 13),
            map(stri('VeVxkVaqKv'), () => 14),
            map(stri('qSCUWGxkHt'), () => 15),
            map(stri('EuAPMOevXm'), () => 16),
            map(stri('WsMosTuXWu'), () => 17),
            map(stri('GqKKqoguqr'), () => 18),
            map(stri('XISDJJlhpv'), () => 19),
            map(stri('OWvRVXxZZr'), () => 20),
            map(stri('EeeNViuver'), () => 21),
            map(stri('NldKAvAKXW'), () => 22),
            map(stri('bsTUlEosYW'), () => 23),
            map(stri('CixASiwFRI'), () => 24),
            map(stri('yNzvVcWver'), () => 25),
            map(stri('xYVPlaaYRb'), () => 26),
            map(stri('KbFIlLoCcB'), () => 27),
            map(stri('XuVOIUlXSf'), () => 28),
            map(stri('ylXTVvRuwO'), () => 29),
            map(stri('olFldPZKYF'), () => 30),
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
