// This just ensures that the type unit tests in the type file are all
// passing

import {assert, UnitTests} from 'advanced-type-tests';
import { NotAny, Yes } from 'advanced-type-tests/dist/UnitTest';

import mongoose from 'mongoose';

interface AddressDocument {
  city: string;
  state: string;
  zip: string;
  printAddress(): void;
}

interface TestDocumentObject extends mongoose.Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  roles: string[];
  addresses: AddressDocument[];
  printObject(): void;
}

type TestDocument = TestDocumentObject;

type t_testDocumentHasId = UnitTests.TypeEquals<TestDocument['_id'], mongoose.Types.ObjectId>;
type t_testDocumentHasSchema = UnitTests.TypeEquals<TestDocument['schema'], mongoose.Schema>;
type t_testDocFunctionExists = UnitTests.TypeExtends<TestDocument['printObject'], Function>;
type t_testSubDocFunctionExists = UnitTests.TypeExtends<TestDocument['addresses'][0]['printAddress'], Function>;
type TESTAGG_DocumentFields = NotAny<Yes
  & t_testDocumentHasId
  & t_testDocumentHasSchema
  & t_testDocFunctionExists
  & t_testSubDocFunctionExists
>;
assert<UnitTests.Yes>(void 0 as unknown as TESTAGG_DocumentFields);


type LeanTestDocument = mongoose.LeanDocument<TestDocument>;
type t_testLeanHasId = UnitTests.TypeEquals<LeanTestDocument['_id'], mongoose.Types.ObjectId>;
type t_testLeanHasNoSchema = UnitTests.TypeNotExtends<'schema', keyof LeanTestDocument>;
type t_testLeanDocFunctionNotExists = UnitTests.TypeNotExtends<'printObject', keyof LeanTestDocument>;
type t_testLeanSubDocFunctionNotExists = UnitTests.TypeNotExtends<'printAddress', keyof LeanTestDocument['addresses'][0]>;

type TESTAGG_LeanDocument = NotAny<Yes
  & t_testLeanHasId
  & t_testLeanHasNoSchema
  & t_testLeanDocFunctionNotExists
  & t_testLeanSubDocFunctionNotExists
>;
assert<UnitTests.Yes>(void 0 as unknown as TESTAGG_LeanDocument);


// const a: TestDocument;
// a.schema


// function assert2<T>(v: T): void {}

// // Add an extra check for an issue I hit when using mongoose lean documents with strict mode enabled
// assert2<null>(void 0 as unknown as LeanDocument<null>);

// assert<UnitTests.Yes>(void 0 as unknown as AUT_Tests.AllTests);
