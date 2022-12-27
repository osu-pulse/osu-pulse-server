import { SystemController } from './system.controller';
import { SubscriptionsService } from '../../shared/services/subscriptions.service';
import { Test } from '@nestjs/testing';
import { createMock } from '@golevelup/ts-jest';
import Mock = jest.Mock;

describe('SystemController', () => {
  let sendMock: Mock;
  let systemController: SystemController;

  beforeEach(async () => {
    sendMock = jest.fn();

    const subscriptionsServiceMock = createMock<SubscriptionsService>({
      send: sendMock,
    });

    const moduleRef = await Test.createTestingModule({
      controllers: [SystemController],
      providers: [
        { provide: SubscriptionsService, useValue: subscriptionsServiceMock },
      ],
    }).compile();

    systemController = moduleRef.get(SystemController);
  });

  it('should be created', () => {
    expect(systemController).toBeDefined();
  });

  describe('health', () => {
    it('should no return', () => {
      expect(systemController.health()).toBeUndefined();
    });
  });
});
