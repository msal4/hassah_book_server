import { InputType, Field } from "type-graphql";
import { IsPhoneNumber, IsNotEmpty } from "class-validator";

@InputType()
export class SendVerificationCodeInput {
  @Field()
  @IsPhoneNumber("IQ")
  phoneNumber: string;

  @Field()
  @IsNotEmpty()
  recaptchaToken: string;
}
