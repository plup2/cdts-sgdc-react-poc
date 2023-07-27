
//https://jestjs.io/docs/getting-started
//https://stackoverflow.com/questions/72371227/jest-i-want-to-put-test-code-under-project-test-directory-but-configuration

import { isUrlRelative } from '../../src/utilities';

test('isUrlRelative empty', () => {
    expect(isUrlRelative()).toBe(false);
    expect(isUrlRelative('')).toBe(false);
});

test('isUrlRelative absolute', () => {
    expect(isUrlRelative('https://www.google.ca')).toBe(false);
    expect(isUrlRelative('https://www.google.ca?l=en')).toBe(false); //with query string parameter for good measure
    expect(isUrlRelative('https://www.google.ca#section')).toBe(false); //with anchor for good measure
});

test('isUrlRelative protocol-relative-is-absolute', () => {
    //(protocol-relative considered absolute for us)
    expect(isUrlRelative('//www.google.ca')).toBe(false);
    expect(isUrlRelative('//www.google.ca?l=en')).toBe(false); //with query string parameter for good measure
    expect(isUrlRelative('//www.google.ca#section')).toBe(false); //with anchor for good measure
});

test('isUrlRelative relative', () => {
    expect(isUrlRelative('/mypage')).toBe(true);
    expect(isUrlRelative('/mypage/other?l=en')).toBe(true); //with query string parameter for good measure
    expect(isUrlRelative('/mypage/other#section')).toBe(true); //with anchor for good measure

    expect(isUrlRelative('mypage')).toBe(true);
    expect(isUrlRelative('mypage/other?l=en')).toBe(true); //with query string parameter for good measure
    expect(isUrlRelative('mypage/other#section')).toBe(true); //with anchor for good measure
});

test('isUrlRelative anchor-relative-is-absolute', () => {
    //(anchor links are considered absolute, see function);
    expect(isUrlRelative('#')).toBe(false);
    expect(isUrlRelative('#bla')).toBe(false);
});
